"""
KalaKitchen Usage Examples
"""
import asyncio
import json
from pathlib import Path
from kalakitchen.workflow import KalaKitchenWorkflow

async def analyze_sample_video():
    """Example: Analyze a cooking video"""
    
    # Initialize workflow
    workflow = KalaKitchenWorkflow()
    
    # Load video file
    video_path = Path("sample_cooking_video.mp4")
    if not video_path.exists():
        print("Please provide a sample cooking video file")
        return
    
    with open(video_path, "rb") as f:
        video_content = f.read()
    
    print("Starting video analysis...")
    
    try:
        # Run complete analysis
        result = await workflow.analyze_video_sync(
            video_content=video_content,
            filename=video_path.name,
            language="en",
            region="US"
        )
        
        # Print results
        print("\n" + "="*60)
        print("ANALYSIS RESULTS")
        print("="*60)
        
        print(f"Recipe Title: {result.recipe_title.text}")
        print(f"Confidence: {result.recipe_title.confidence}%")
        print(f"Duration: {result.duration_seconds:.1f} seconds")
        print(f"Status: {result.status}")
        
        print(f"\nSteps ({len(result.steps)}):")
        for i, step in enumerate(result.steps[:3], 1):  # Show first 3 steps
            print(f"  {i}. [{step.start:.1f}s-{step.end:.1f}s] {step.text}")
        
        print(f"\nIngredients ({len(result.ingredients)}):")
        for ingredient in result.ingredients[:5]:  # Show first 5 ingredients
            quantity_str = f"{ingredient.quantity} {ingredient.unit}" if ingredient.quantity else "Amount not specified"
            estimated_str = " (estimated)" if ingredient.estimated else ""
            print(f"  • {ingredient.name}: {quantity_str}{estimated_str}")
        
        print(f"\nNutrition Summary:")
        if result.nutrition_summary.total_calories:
            print(f"  Total Calories: {result.nutrition_summary.total_calories:.0f}")
            print(f"  Servings: {result.nutrition_summary.servings}")
            if result.nutrition_summary.per_serving:
                per_serving_cal = result.nutrition_summary.per_serving.get('calories', 0)
                print(f"  Per Serving: {per_serving_cal:.0f} calories")
        
        print(f"\nQuality Scores:")
        print(f"  Authenticity: {result.authenticity_score}%")
        print(f"  Completeness: {result.completeness_score}%")
        
        print(f"\nLearning Pack:")
        for bullet in result.learner_pack.bullets:
            print(f"  • {bullet}")
        
        print(f"\nQuiz Questions:")
        for i, question in enumerate(result.learner_pack.quiz, 1):
            print(f"  {i}. {question.question}")
            for j, option in enumerate(question.options):
                marker = "✓" if j == question.correct_answer else " "
                print(f"     {marker} {chr(65+j)}. {option}")
        
        print(f"\nProcessing completed in {result.processing_time_seconds:.1f} seconds")
        
        # Save detailed results
        output_file = "analysis_results.json"
        with open(output_file, "w") as f:
            json.dump(result.dict(), f, indent=2, default=str)
        print(f"\nDetailed results saved to: {output_file}")
        
    except Exception as e:
        print(f"Analysis failed: {e}")

async def analyze_with_status_tracking():
    """Example: Analyze video with status tracking"""
    
    workflow = KalaKitchenWorkflow()
    
    # Start analysis (non-blocking)
    video_path = Path("sample_cooking_video.mp4")
    with open(video_path, "rb") as f:
        video_content = f.read()
    
    video_id = await workflow.analyze_video(
        video_content, video_path.name, "en", "US"
    )
    
    print(f"Analysis started with ID: {video_id}")
    
    # Track progress
    while True:
        status = workflow.get_status(video_id)
        if not status:
            print("Status not found")
            break
        
        print(f"Progress: {status.progress}% - {status.current_stage}")
        
        if status.status == "completed":
            result = workflow.get_result(video_id)
            print(f"Analysis complete! Recipe: {result.recipe_title.text}")
            break
        elif status.status == "failed":
            print(f"Analysis failed: {status.error_message}")
            break
        
        await asyncio.sleep(2)  # Check every 2 seconds

if __name__ == "__main__":
    # Run the example
    asyncio.run(analyze_sample_video())