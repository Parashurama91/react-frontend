import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DeviceTypeChart = ({ title, deviceTypes = {}, isDarkMode }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { data, total } = useMemo(() => {
    const entries = Object.entries(deviceTypes);
    const formatted = entries.map(([key, value], i) => ({
      name: key,
      value,
      color: COLORS[i % COLORS.length],
      percentage: 0,
    }));
    const totalCount = entries.reduce((acc, [, val]) => acc + val, 0);

    formatted.forEach(item => {
      item.percentage = totalCount > 0 ? ((item.value / totalCount) * 100).toFixed(1) : 0;
    });

    return { data: formatted, total: totalCount };
  }, [deviceTypes]);

  const CustomTooltip = ({ active, payload, coordinate }) => {
    if (!active || !payload || !payload.length || hoveredIndex === null) return null;
    const item = payload[0].payload;

    return (
      <div
        className="absolute z-10 px-3 py-2 rounded-lg shadow-lg border"
        style={{
          top: coordinate.y - 20,
          left: 200, 
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
          color: isDarkMode ? '#E5E7EB' : '#1F2937',
          pointerEvents: 'none',
          width: '160px',
        }}
      >
        <div className="flex items-center space-x-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium">{item.name}</span>
        </div>
        <div className="text-sm">
          <div>
            Count: <span className="font-semibold">{item.value}</span>
          </div>
          <div>
            Percentage: <span className="font-semibold">{item.percentage}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md"
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

      <div className="relative flex items-start justify-center gap-4 mb-4">
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
                onClick={(e) => e.preventDefault()} // Prevent focus on click
                style={{
                  outline: 'none', // 🔹 Removes the blue focus ring
                  filter: hoveredIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                  transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'center',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} trigger="hover" />
        </PieChart>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-2xl font-bold"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {total}
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {data.map((item, i) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm p-2 rounded transition-all duration-200"
            style={{
              backgroundColor:
                hoveredIndex === i
                  ? isDarkMode
                    ? '#374151'
                    : '#F3F4F6'
                  : 'transparent',
              cursor: 'default'
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full transition-transform duration-200"
                style={{
                  backgroundColor: item.color,
                  transform: hoveredIndex === i ? 'scale(1.2)' : 'scale(1)',
                }}
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

export default React.memo(DeviceTypeChart);