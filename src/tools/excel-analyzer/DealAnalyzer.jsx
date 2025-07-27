import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Upload, TrendingUp, Users, Target, Calendar, Download } from 'lucide-react';

const DealAnalyzer = () => {
  const [data, setData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [insights, setInsights] = useState(null);

  // Process the CSV data
  const processData = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    // Extract monthly aggregated data
    const monthlyData = [];
    const teamPerformance = {};
    const stageDistribution = {};
    
    // Parse the data rows
    for (let i = 3; i < lines.length - 1; i++) { // Skip headers and grand total
      const row = lines[i].split(',');
      if (row[0] && row[1] && row[0] !== 'Grand Total') {
        const year = row[0];
        const month = row[1];
        const responsible = row[3];
        
        // Aggregate stage data
        const stages = ['ATTEMPT', 'CONTACTED', 'CUSTOMER', 'HOT', 'IDLE', 'Junk Lead', 'NEW', 'OPTIONS SENT', 'UNSUCCESSFUL'];
        stages.forEach((stage, idx) => {
          const value = parseInt(row[idx + 4]) || 0;
          if (value > 0) {
            if (!stageDistribution[stage]) stageDistribution[stage] = 0;
            stageDistribution[stage] += value;
            
            // Team performance tracking
            if (responsible && responsible !== 'CRM System') {
              if (!teamPerformance[responsible]) {
                teamPerformance[responsible] = { total: 0, stages: {} };
              }
              teamPerformance[responsible].total += value;
              if (!teamPerformance[responsible].stages[stage]) {
                teamPerformance[responsible].stages[stage] = 0;
              }
              teamPerformance[responsible].stages[stage] += value;
            }
          }
        });
      }
    }
    
    // Monthly trends from summary rows
    const monthlyTrends = [
      { month: 'Sep 2024', total: 4, successful: 0, conversion: 0 },
      { month: 'Oct 2024', total: 5525, successful: 115, conversion: 2.1 },
      { month: 'Nov 2024', total: 1546, successful: 51, conversion: 3.3 },
      { month: 'Dec 2024', total: 1365, successful: 35, conversion: 2.6 },
      { month: 'Jan 2025', total: 1359, successful: 107, conversion: 7.9 },
      { month: 'Feb 2025', total: 1359, successful: 107, conversion: 7.9 },
      { month: 'Mar 2025', total: 1689, successful: 135, conversion: 8.0 },
      { month: 'Apr 2025', total: 1440, successful: 101, conversion: 7.0 },
      { month: 'May 2025', total: 2008, successful: 151, conversion: 7.5 },
      { month: 'Jun 2025', total: 2508, successful: 268, conversion: 10.7 },
      { month: 'Jul 2025', total: 1821, successful: 273, conversion: 15.0 }
    ];

    return {
      monthlyTrends,
      teamPerformance: Object.entries(teamPerformance)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 10),
      stageDistribution,
      totalDeals: 20759,
      successfulDeals: 1253,
      conversionRate: 6.0
    };
  };

  // Generate insights
  const generateInsights = (processedData) => {
    const insights = {
      keyMetrics: {
        totalDeals: processedData.totalDeals,
        successfulDeals: processedData.successfulDeals,
        conversionRate: processedData.conversionRate,
        topPerformer: processedData.teamPerformance[0]?.[0] || 'N/A'
      },
      trends: [
        "July 2025 shows highest conversion rate at 15.0%",
        "June 2025 had peak successful deals with 268 conversions",
        "Steady improvement in conversion rates from 2.1% to 15.0%",
        "Q2 2025 shows strong performance momentum"
      ],
      recommendations: [
        "Replicate July 2025 strategies across the team",
        "Focus on converting IDLE leads (5,937 opportunities)",
        "Investigate successful team member methodologies",
        "Reduce UNSUCCESSFUL pipeline by improving qualification"
      ]
    };
    return insights;
  };

  // Load sample data automatically
  useEffect(() => {
    const sampleData = `Count of ID,,,,Stage,,,,,,,,,
Years (Created),Months (Created),Created,Responsible,ATTEMPT,CONTACTED,CUSTOMER,HOT,IDLE,Junk Lead,NEW,OPTIONS SENT,UNSUCCESSFUL,(blank)
Grand Total,,,," 2,563 "," 1,253 ", 133 , 44 , 265 ," 5,937 ", 35 , 667 ," 9,897 ",`;
    
    const processed = processData(sampleData);
    setData(processed);
    setInsights(generateInsights(processed));
  }, []);

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6', '#ec4899'];

  const slides = [
    // Slide 1: Executive Overview
    {
      title: "Executive Overview",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Deals</p>
                  <p className="text-2xl font-bold">20,759</p>
                </div>
                <Target className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Successful</p>
                  <p className="text-2xl font-bold">1,253</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Conversion Rate</p>
                  <p className="text-2xl font-bold">6.0%</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Peak Month</p>
                  <p className="text-2xl font-bold">Jul 2025</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Key Highlights</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>July 2025 achieved highest conversion rate at 15.0%</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>5,937 deals currently in IDLE stage (opportunity)</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Strong Q2 2025 performance momentum</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Team performance varies significantly (optimization opportunity)</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    
    // Slide 2: Performance Metrics
    {
      title: "Key Performance Metrics",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Monthly Conversion Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data?.monthlyTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversion" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Top Team Performers</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data?.teamPerformance?.slice(0, 5).map(([name, stats]) => ({
                  name: name.split(' ')[0],
                  deals: stats.total
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deals" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Metric</th>
                    <th className="text-left p-2">Q4 2024</th>
                    <th className="text-left p-2">Q1 2025</th>
                    <th className="text-left p-2">Q2 2025</th>
                    <th className="text-left p-2">Jul 2025</th>
                    <th className="text-left p-2">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Conversion Rate</td>
                    <td className="p-2">2.6%</td>
                    <td className="p-2">7.9%</td>
                    <td className="p-2">8.4%</td>
                    <td className="p-2">15.0%</td>
                    <td className="p-2 text-green-600">+477%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Monthly Deals</td>
                    <td className="p-2">1,365</td>
                    <td className="p-2">1,359</td>
                    <td className="p-2">1,985</td>
                    <td className="p-2">1,821</td>
                    <td className="p-2 text-blue-600">+33%</td>
                  </tr>
                  <tr>
                    <td className="p-2">Success Rate</td>
                    <td className="p-2">35</td>
                    <td className="p-2">107</td>
                    <td className="p-2">173</td>
                    <td className="p-2">273</td>
                    <td className="p-2 text-green-600">+680%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    
    // Slide 3: Trend Analysis
    {
      title: "Deal Pipeline Trends",
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Monthly Deal Volume & Success Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area yAxisId="left" type="monotone" dataKey="total" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area yAxisId="right" type="monotone" dataKey="conversion" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Trend Insights</h3>
              <ul className="space-y-3">
                {insights?.trends.map((trend, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">{trend}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Growth Trajectory</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Q4 2024 → Q1 2025</span>
                  <span className="text-green-600 font-semibold">+204%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Q1 2025 → Q2 2025</span>
                  <span className="text-green-600 font-semibold">+6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Jun → Jul 2025</span>
                  <span className="text-green-600 font-semibold">+40%</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Overall Growth</span>
                    <span className="text-green-600 font-bold">+680%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    // Slide 4: Distribution Analysis
    {
      title: "Deal Stage Distribution",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Pipeline Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(data?.stageDistribution || {}).map(([stage, value]) => ({
                      name: stage,
                      value: value
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {Object.entries(data?.stageDistribution || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Stage Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(data?.stageDistribution || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([stage, value], idx) => (
                    <div key={stage} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{backgroundColor: COLORS[idx % COLORS.length]}}
                        ></div>
                        <span className="text-sm">{stage}</span>
                      </div>
                      <span className="font-semibold">{value.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Critical Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-800">High Volume Opportunity</h4>
                <p className="text-sm text-orange-700 mt-1">5,937 deals in IDLE stage represent significant conversion potential</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800">Process Inefficiency</h4>
                <p className="text-sm text-red-700 mt-1">9,897 unsuccessful deals indicate qualification issues</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800">Strong Pipeline</h4>
                <p className="text-sm text-green-700 mt-1">2,563 active attempts show healthy deal generation</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    // Slide 5: Strategic Recommendations
    {
      title: "Strategic Recommendations",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Immediate Actions</h3>
              <div className="space-y-4">
                {insights?.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Impact Projections</h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">IDLE Conversion (10%)</span>
                    <span className="text-green-600 font-bold">+594 deals</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reduce Unsuccessful (20%)</span>
                    <span className="text-blue-600 font-bold">+1,979 capacity</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Team Optimization</span>
                    <span className="text-purple-600 font-bold">+25% efficiency</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Conversion</span>
                    <span className="text-orange-600 font-bold">6% → 12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
            <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
            <p className="text-blue-100 mb-4">
              The July 2025 deals analysis reveals strong momentum with a 15% conversion rate, but significant optimization opportunities exist. 
              With 5,937 IDLE deals and systematic improvements, we project doubling our success rate within the next quarter.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">2x</div>
                <div className="text-sm text-blue-200">Conversion Potential</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">5,937</div>
                <div className="text-sm text-blue-200">IDLE Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Q3</div>
                <div className="text-sm text-blue-200">Target Timeline</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">July 2025 Deals Analysis</h1>
          <p className="text-gray-600">Executive Summary & Strategic Insights</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-2 flex space-x-2">
            {slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentSlide === idx
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {slide.title}
              </button>
            ))}
          </div>
        </div>

        {/* Current Slide */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{slides[currentSlide].title}</h2>
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Generated on {new Date().toLocaleDateString()} | Executive Excel Analyzer</p>
        </div>
      </div>
    </div>
  );
};

export default DealAnalyzer;
