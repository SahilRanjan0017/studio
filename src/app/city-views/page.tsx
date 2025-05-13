// src/app/city-views/page.tsx
'use client'; 

import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinned, Loader2 } from 'lucide-react';
import { useCityFilter } from '@/contexts/CityFilterContext'; 
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; 
import { Skeleton } from '@/components/ui/skeleton';

// Example: Define a type for city-specific data you might fetch
interface CityData {
  totalProjects: number;
  averageScore: number;
  greenProjects: number;
  amberProjects: number;
  redProjects: number;
}

export default function CityViewsPage() {
  const { selectedCity, loadingCities, cityError } = useCityFilter();
  const [citySpecificData, setCitySpecificData] = useState<CityData | null>(null);
  const [loadingCityData, setLoadingCityData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCityDetails() {
      if (selectedCity === "Pan India" || loadingCities || cityError) {
        setCitySpecificData(null); 
        setLoadingCityData(false);
        setFetchError(cityError ? `City filter error: ${cityError}` : null);
        return;
      }

      setLoadingCityData(true);
      setFetchError(null);
      
      // Simulate fetching data for the selected city
      // Replace this with your actual Supabase query
      try {
        // Example: Fetch aggregated project counts by RAG status for the city
        // This is a simplified example. You'd likely have a view or more complex query.
        const { data: projectCounts, error: countError } = await supabase
          .from('project_performance_view') // Assuming this view has city and current_rag_status
          .select('current_rag_status, crn_id')
          .eq('city', selectedCity);

        if (countError) throw countError;

        const greenProjects = projectCounts?.filter(p => p.current_rag_status === 'Green').length || 0;
        const amberProjects = projectCounts?.filter(p => p.current_rag_status === 'Amber').length || 0;
        const redProjects = projectCounts?.filter(p => p.current_rag_status === 'Red').length || 0;
        const totalProjects = greenProjects + amberProjects + redProjects;
        
        // Simulate fetching average score (replace with actual calculation)
        const { data: scoreData, error: scoreError } = await supabase
            .from('project_performance_view')
            .select('cumulative_score')
            .eq('city', selectedCity);

        if (scoreError) throw scoreError;
        
        const averageScore = scoreData && scoreData.length > 0 
            ? scoreData.reduce((sum, item) => sum + (item.cumulative_score || 0), 0) / scoreData.length 
            : 0;

        setCitySpecificData({
          totalProjects,
          averageScore: parseFloat(averageScore.toFixed(2)),
          greenProjects,
          amberProjects,
          redProjects,
        });

      } catch (error: any) {
        console.error(`Error fetching data for ${selectedCity}:`, error);
        setFetchError(`Failed to load data for ${selectedCity}. ${error.message || ''}`);
        setCitySpecificData(null);
      } finally {
        setLoadingCityData(false);
      }
    }

    fetchCityDetails();
  }, [selectedCity, loadingCities, cityError]);

  const pageSubtitle = selectedCity === "Pan India" 
    ? "Performance overview by city. Select a city from the navbar to see details." 
    : `Performance overview for ${selectedCity}.`;

  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<MapPinned size={28} className="text-primary" />}
          title="City Views"
          subtitle={pageSubtitle}
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>
              {selectedCity === "Pan India" ? "City Performance Dashboard" : `Details for ${selectedCity}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCities ? (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Loading city filter options...</span>
              </div>
            ) : cityError ? (
              <p className="text-destructive">Error initializing city filter: {cityError}</p>
            ) : selectedCity === "Pan India" ? (
              <p className="text-muted-foreground">Select a specific city from the navbar filter to view its detailed performance metrics and comparisons.</p>
            ) : loadingCityData ? (
              <div className="space-y-3 py-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ) : fetchError ? (
              <p className="text-destructive">{fetchError}</p>
            ) : citySpecificData ? (
              <div className="space-y-2">
                <p><strong>Total Projects:</strong> {citySpecificData.totalProjects}</p>
                <p><strong>Average Cumulative Score:</strong> {citySpecificData.averageScore.toFixed(2)}</p>
                <p className="text-custom-green"><strong>Green Projects:</strong> {citySpecificData.greenProjects}</p>
                <p className="text-custom-amber"><strong>Amber Projects:</strong> {citySpecificData.amberProjects}</p>
                <p className="text-custom-red"><strong>Red Projects:</strong> {citySpecificData.redProjects}</p>
                {/* Add more detailed city-specific data display here */}
              </div>
            ) : (
              <p className="text-muted-foreground">No specific data available for {selectedCity}. This could be due to no projects in this city or an issue fetching data.</p>
            )}
            {selectedCity !== "Pan India" && !loadingCityData && !fetchError && !citySpecificData && !loadingCities && !cityError && (
                 <p className="mt-4 text-sm text-muted-foreground"><em>(If you expected data, please check if projects exist for {selectedCity} in the database.)</em></p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
