import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Charts.css';

function PostsPerGroupChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 100, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.groupName))
      .range([0, width])
      .padding(0.3);

    // Y Scale
    const maxCount = d3.max(data, d => d.postsCount);
    const y = d3.scaleLinear()
      .domain([0, maxCount + 2])
      .nice()
      .range([height, 0]);

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.groupName))
      .range(d3.schemeSet2);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '11px')
      .style('font-weight', '500');

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

    // Draw bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.groupName))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', d => colorScale(d.groupName))
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.7);

        // Show tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${x(d.groupName) + x.bandwidth() / 2},${y(d.postsCount) - 20})`);

        tooltip.append('rect')
          .attr('x', -40)
          .attr('y', -30)
          .attr('width', 80)
          .attr('height', 30)
          .attr('fill', '#333')
          .attr('rx', 4);

        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .attr('dy', '-15')
          .text(d.groupName);

        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .text(`${d.postsCount} posts`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);

        svg.selectAll('.tooltip').remove();
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.postsCount))
      .attr('height', d => height - y(d.postsCount))
      .delay((d, i) => i * 100);

    // Add value labels on top of bars
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.groupName) + x.bandwidth() / 2)
      .attr('y', d => y(d.postsCount) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(d => d.postsCount)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 400)
      .style('opacity', 1);

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
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Groups');

  }, [data]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">📊 Posts Per Group</h3>
      {data && data.length === 0 ? (
        <p className="no-data-message">No group posts yet</p>
      ) : (
        <svg ref={svgRef}></svg>
      )}
    </div>
  );
}

export default PostsPerGroupChart;

