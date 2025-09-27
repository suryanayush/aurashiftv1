// Chart data for dashboard
export interface ChartDataPoint {
  day: string;
  cigarettesAvoided: number;
  moneySaved: number;
  healthScore: number;
  auraPoints: number;
}

export const generateWeeklyChartData = (): ChartDataPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return days.map((day, index) => ({
    day,
    cigarettesAvoided: Math.floor(Math.random() * 20) + index * 2,
    moneySaved: Math.floor(Math.random() * 50) + index * 5,
    healthScore: Math.min(100, 60 + index * 5 + Math.floor(Math.random() * 10)),
    auraPoints: Math.floor(Math.random() * 30) + index * 3,
  }));
};

export const getProgressChartData = () => {
  const weeklyData = generateWeeklyChartData();
  
  return {
    labels: weeklyData.map(item => item.day),
    datasets: [
      {
        data: weeklyData.map(item => item.cigarettesAvoided),
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red line for cigarettes avoided
        strokeWidth: 3,
      },
      {
        data: weeklyData.map(item => item.auraPoints),
        color: (opacity = 1) => `rgba(251, 113, 133, ${opacity})`, // Light red line for aura points
        strokeWidth: 2,
      },
    ],
  };
};

export const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#ef4444',
  },
};
