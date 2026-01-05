"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForecastChartProps {
  className?: string;
}

export function ForecastChart({ className }: ForecastChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          Forecast chart will be implemented later
        </div>
      </CardContent>
    </Card>
  );
}
