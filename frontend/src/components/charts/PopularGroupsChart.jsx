import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Charts.css';

function PopularGroupsChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.groupName))
      .range(d3.schemeSet3);

    // Pie generator
    const pie = d3.pie()
      .value(d => d.membersCount)
      .sort(null);

    // Arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Arc generator for hover effect
    const arcHover = d3.arc()
      .innerRadius(0)
      .outerRadius(radius + 10);

    // Create pie slices
    const slices = svg.selectAll('.slice')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'slice');

    // Draw pie slices
    slices.append('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.groupName))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('opacity', 0.85)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover)
          .style('opacity', 1);

        // Show tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(0, ${-radius - 40})`);

        tooltip.append('rect')
          .attr('x', -70)
          .attr('y', -35)
          .attr('width', 140)
          .attr('height', 35)
          .attr('fill', '#333')
          .attr('rx', 6);

        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .attr('dy', '-20')
          .text(d.data.groupName);

        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '11px')
          .attr('dy', '-5')
          .text(`${d.data.membersCount} members`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc)
          .style('opacity', 0.85);

        svg.selectAll('.tooltip').remove();
      })
      .transition()
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    // Add percentage labels
    slices.append('text')
      .attr('transform', d => {
        const pos = arc.centroid(d);
        return `translate(${pos})`;
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.6)')
      .style('opacity', 0)
      .text(d => {
        const total = d3.sum(data, item => item.membersCount);
        const percentage = ((d.data.membersCount / total) * 100).toFixed(1);
        return percentage > 5 ? `${percentage}%` : ''; // Only show if > 5%
      })
      .transition()
      .duration(800)
      .delay(400)
      .style('opacity', 1);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${radius + 20}, ${-radius})`);

    const legendItems = legend.selectAll('.legend-item')
      .data(data.slice(0, 5)) // Show top 5 in legend
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => colorScale(d.groupName))
      .attr('rx', 3);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '11px')
      .style('fill', '#333')
      .text(d => {
        const name = d.groupName.length > 12 
          ? d.groupName.substring(0, 12) + '...' 
          : d.groupName;
        return `${name} (${d.membersCount})`;
      });

  }, [data]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">👥 Popular Groups by Members</h3>
      {data && data.length === 0 ? (
        <p className="no-data-message">No groups yet</p>
      ) : (
        <svg ref={svgRef}></svg>
      )}
    </div>
  );
}

export default PopularGroupsChart;

