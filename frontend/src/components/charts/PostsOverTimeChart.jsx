import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Charts.css';

function PostsOverTimeChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.1);

    // Y Scale
    const maxCount = d3.max(data, d => d.count);
    const y = d3.scaleLinear()
      .domain([0, maxCount + 2])
      .nice()
      .range([height, 0]);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // Grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(''))
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.2);

    // Line generator
    const line = d3.line()
      .x(d => x(d.month) + x.bandwidth() / 2)
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    // Draw line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#1976d2')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add dots
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.month) + x.bandwidth() / 2)
      .attr('cy', d => y(d.count))
      .attr('r', 5)
      .attr('fill', '#1976d2')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('fill', '#1565c0');
        
        // Show tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${x(d.month) + x.bandwidth() / 2},${y(d.count) - 20})`);

        tooltip.append('rect')
          .attr('x', -30)
          .attr('y', -25)
          .attr('width', 60)
          .attr('height', 25)
          .attr('fill', '#333')
          .attr('rx', 4);

        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .attr('dy', '-8')
          .text(`${d.count} posts`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5)
          .attr('fill', '#1976d2');
        
        svg.selectAll('.tooltip').remove();
      });

    // Y Axis Label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Number of Posts');

    // X Axis Label
    svg.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 5})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Month');

  }, [data]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">📈 Posts Over Time (Last 6 Months)</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default PostsOverTimeChart;

