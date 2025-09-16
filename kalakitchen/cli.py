"""
KalaKitchen Command Line Interface
"""
import asyncio
import argparse
import json
from pathlib import Path
from .workflow import KalaKitchenWorkflow

async def main():
    parser = argparse.ArgumentParser(description="KalaKitchen Video Analysis")
    parser.add_argument("video_path", help="Path to cooking video file")
    parser.add_argument("--language", default="en", help="Video language (default: en)")
    parser.add_argument("--region", default="US", help="Video region (default: US)")
    parser.add_argument("--output", "-o", help="Output JSON file path")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    # Validate video file
    video_path = Path(args.video_path)
    if not video_path.exists():
        print(f"Error: Video file not found: {video_path}")
        return
    
    # Read video file
    with open(video_path, "rb") as f:
        video_content = f.read()
    
    print(f"Analyzing video: {video_path.name}")
    print(f"Language: {args.language}, Region: {args.region}")
    print("-" * 50)
    
    # Initialize workflow
    workflow = KalaKitchenWorkflow()
    
    try:
        # Run analysis
        result = await workflow.analyze_video_sync(
            video_content, video_path.name, args.language, args.region
        )
        
        # Output results
        if args.output:
            output_path = Path(args.output)
            with open(output_path, "w") as f:
                json.dump(result.dict(), f, indent=2, default=str)
            print(f"Results saved to: {output_path}")
        else:
            # Print summary
            print("\n" + "="*60)
            print("ANALYSIS COMPLETE")
            print("="*60)
            print(f"Recipe: {result.recipe_title.text}")
            print(f"Duration: {result.duration_seconds:.1f} seconds")
            print(f"Steps: {len(result.steps)}")
            print(f"Ingredients: {len(result.ingredients)}")
            print(f"Tools: {len(result.tools)}")
            print(f"Authenticity Score: {result.authenticity_score}%")
            print(f"Completeness Score: {result.completeness_score}%")
            print(f"Status: {result.status}")
            
            if result.nutrition_summary.total_calories:
                print(f"Total Calories: {result.nutrition_summary.total_calories:.0f}")
                print(f"Servings: {result.nutrition_summary.servings}")
            
            print(f"\nProcessing Time: {result.processing_time_seconds:.1f} seconds")
            
            if args.verbose:
                print("\n" + "-"*40)
                print("DETAILED RESULTS")
                print("-"*40)
                print(json.dumps(result.dict(), indent=2, default=str))
    
    except Exception as e:
        print(f"Error: {e}")
        return

if __name__ == "__main__":
    asyncio.run(main())