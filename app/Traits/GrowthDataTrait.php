<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Models\User; 
use App\Models\Community; 
use App\Models\Post; 
use App\Models\Problem;
use App\Models\Workfolio;
use App\Models\CompanyJob; 
use App\Models\Freelance; 
use App\Models\Company; 


trait GrowthDataTrait
{
    // Fetch growth data for each month in a given year
    public function getYearlyGrowthData($year)
    {
        $monthlyData = [];
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;;

        for ($i = 1; $i <= 12; $i++) {
					
					 // If the year is the current year and the month is in the future, skip it
            if ($year == $currentYear && $i > $currentMonth) {
                break;
            }
						
            $startOfMonth = Carbon::create($year, $i, 1, 0, 0, 0);
            $endOfMonth = $startOfMonth->copy()->endOfMonth();

            $monthlyData[] = [
                'month' => $startOfMonth->format('F'), // e.g., January, February
                'users' => User::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
                'posts' => Post::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
                 
                'jobs' => CompanyJob::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
                'freelance' => Freelance::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
                'community' => Community::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
                'problem' => Problem::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
                'workfolio' => Workfolio::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
                'company' => Company::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
            ];
        }

        return $monthlyData;
    }

    // Fetch growth data for each day in a given month & year
		private function getDailyGrowthData($year, $month)
		{
				 $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $currentDate = Carbon::now();

        // If the selected month is the current month, limit to today's date
        if ($year == $currentDate->year && $month == $currentDate->month) {
            $endOfMonth = $currentDate->copy()->endOfDay();
        }

				for ($date = $startOfMonth->copy(); $date->lessThanOrEqualTo($endOfMonth); $date->addDay()) {
						$dailyData[] = [
								'day' => $date->format('d M'),
								'users' => User::whereDate('created_at', $date)->count(),
								'posts' => Post::whereDate('created_at', $date)->count(),
 
								'jobs' => CompanyJob::whereDate('created_at', $date)->count(),
								'freelance' => Freelance::whereDate('created_at', $date)->count(),
								'community' => Community::whereDate('created_at', $date)->count(),
								'problem' => Problem::whereDate('created_at', $date)->count(),
								'workfolio' => Workfolio::whereDate('created_at', $date)->count(),
								'company' => Company::whereDate('created_at', $date)->count(),
						];
				}

				return $dailyData;
		}



}
