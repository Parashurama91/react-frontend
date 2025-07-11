import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const STATUS_COLORS = {
  active: '#10B981',
  inactive: '#EF4444',
};

const DeviceStatusChart = ({ title, value, activeCount, inactiveCount, isDarkMode }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { data, total } = useMemo(() => {
    const totalCount = activeCount + inactiveCount;
    const formatted = [
      {
        name: 'Active',
        value: activeCount,
        color: STATUS_COLORS.active,
        percentage: totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : 0,
      },
      {
        name: 'Inactive',
        value: inactiveCount,
        color: STATUS_COLORS.inactive,
        percentage: totalCount > 0 ? ((inactiveCount / totalCount) * 100).toFixed(1) : 0,
      },
    ];
    return { data: formatted, total: totalCount };
  }, [activeCount, inactiveCount]);

  const renderCustomTooltip = () => {
    if (hoveredIndex === null) return null;
    const item = data[hoveredIndex];

    return (
      <div
        className="absolute top-0 left-full ml-4 p-3 rounded-lg shadow-lg border text-sm"
        style={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
          color: isDarkMode ? '#E5E7EB' : '#1F2937',
          transform: `translateY(${hoveredIndex * 60}px)`, // offset based on index
          minWidth: 140,
          zIndex: 10,
          transition: 'transform 0.3s ease',
        }}
      >
        <div className="flex items-center space-x-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium">{item.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <span>Count:</span>
          <span className="text-right font-semibold">{item.value}</span>
          <span>Percent:</span>
          <span className="text-right font-semibold">{item.percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md relative"
      style={{
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
      }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
      >
        {title}
      </h3>

      <div className="relative flex items-start justify-center gap-8 mb-4">
        <div className="relative">
          <PieChart width={176} height={176}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              stroke="none"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  onClick={(e) => e.preventDefault()}
                  style={{
                    outline: 'none',
                    transition: 'all 0.3s ease-in-out',
                    transform: hoveredIndex === index ? 'scale(1.08)' : 'scale(1)',
                    transformOrigin: 'center',
                    filter: hoveredIndex === index ? 'brightness(1.15)' : 'brightness(1)',
                    cursor: 'pointer',
                    opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.6 : 1,
                  }}
                />
              ))}
            </Pie>
          </PieChart>

          {/* Central Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-2xl font-bold"
              style={{
                color: isDarkMode ? '#FFFFFF' : '#1F2937',
                transform: hoveredIndex !== null ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {value ?? total}
            </span>
          </div>

          {/* Static Custom Tooltip on hover */}
          {renderCustomTooltip()}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.map((item, i) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm p-2 rounded transition-all duration-200"
            style={{
              backgroundColor: hoveredIndex === i
                ? (isDarkMode ? '#374151' : '#F3F4F6')
                : 'transparent',
              cursor: 'default'
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                {item.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
                {item.value}
              </span>
              <span
                className="text-xs"
                style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              >
                ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceStatusChart;