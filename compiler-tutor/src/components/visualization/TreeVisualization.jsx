import React, { useMemo } from 'react';

/**
 * Reusable SVG parse tree renderer.
 *
 * Props:
 *   tree: { label: string, value?: string|number, children?: tree[], highlight?: boolean }
 *   width?: number (auto-computed if not given)
 *   height?: number (auto-computed if not given)
 *   nodeRadius?: number
 *   highlightNodes?: Set<string>  (set of node ids to highlight)
 *   showValues?: boolean
 */

const NODE_H_GAP = 28;
const NODE_V_GAP = 80;
const NODE_RADIUS = 22;
const FONT_SIZE = 13;
const VAL_FONT_SIZE = 11;

function measureTree(node, depth = 0) {
  if (!node) return { width: 0, height: 0 };
  if (!node.children || node.children.length === 0) {
    return { width: NODE_RADIUS * 2 + NODE_H_GAP, height: depth * NODE_V_GAP + NODE_RADIUS * 2, node, depth };
  }
  let totalWidth = 0;
  const childMeasures = node.children.map(c => {
    const m = measureTree(c, depth + 1);
    totalWidth += m.width;
    return m;
  });
  totalWidth += (node.children.length - 1) * NODE_H_GAP;
  totalWidth = Math.max(totalWidth, NODE_RADIUS * 2 + NODE_H_GAP);
  const maxHeight = Math.max(...childMeasures.map(m => m.height));
  return { width: totalWidth, height: maxHeight, childMeasures, node, depth };
}

function layoutTree(node, x, y, depth = 0) {
  if (!node) return [];
  const positions = [];
  const id = `${node.label}-${depth}-${x.toFixed(0)}`;

  if (!node.children || node.children.length === 0) {
    positions.push({ id, label: node.label, value: node.value, x, y, highlight: node.highlight, children: [] });
    return positions;
  }

  const m = measureTree(node, depth);
  let childX = x - m.width / 2;
  const childPositions = [];

  node.children.forEach((child, i) => {
    const cm = measureTree(child, depth + 1);
    const cx = childX + cm.width / 2;
    const cy = y + NODE_V_GAP;
    const childLayout = layoutTree(child, cx, cy, depth + 1);
    childPositions.push({ cx, cy, layout: childLayout });
    childX += cm.width + NODE_H_GAP;
  });

  const nodePos = {
    id,
    label: node.label,
    value: node.value,
    x,
    y,
    highlight: node.highlight,
    children: childPositions.map(cp => ({ x: cp.cx, y: cp.cy })),
  };

  positions.push(nodePos);
  childPositions.forEach(cp => positions.push(...cp.layout));
  return positions;
}

export default function TreeVisualization({ tree, showValues = false, maxWidth = 800 }) {
  const positions = useMemo(() => {
    if (!tree) return [];
    const m = measureTree(tree);
    const rootX = m.width / 2 + 30;
    const rootY = NODE_RADIUS + 20;
    return layoutTree(tree, rootX, rootY);
  }, [tree]);

  if (!tree || positions.length === 0) {
    return (
      <div className="viz-canvas" style={{ padding: 32, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
        Nenhuma árvore para exibir.
      </div>
    );
  }

  const allX = positions.map(p => p.x);
  const allY = positions.map(p => p.y);
  const minX = Math.min(...allX) - NODE_RADIUS - 20;
  const maxX = Math.max(...allX) + NODE_RADIUS + 20;
  const minY = Math.min(...allY) - NODE_RADIUS - 20;
  const maxY = Math.max(...allY) + NODE_RADIUS + (showValues ? 40 : 20);

  const svgWidth = maxX - minX;
  const svgHeight = maxY - minY;

  return (
    <div className="viz-canvas" style={{ overflowX: 'auto', padding: 12 }}>
      <svg
        width={Math.min(svgWidth, maxWidth)}
        height={svgHeight}
        viewBox={`${minX} ${minY} ${svgWidth} ${svgHeight}`}
        style={{ display: 'block', margin: '0 auto' }}
      >
        {/* Edges */}
        {positions.map((pos) =>
          pos.children.map((child, ci) => (
            <line
              key={`${pos.id}-edge-${ci}`}
              x1={pos.x}
              y1={pos.y + NODE_RADIUS}
              x2={child.x}
              y2={child.y - NODE_RADIUS}
              className="edge-line"
              stroke="var(--text-muted)"
              strokeWidth={1.5}
              opacity={0.5}
            />
          ))
        )}
        {/* Nodes */}
        {positions.map((pos) => {
          const isTerminal = pos.children.length === 0;
          const isHighlight = pos.highlight;
          return (
            <g key={pos.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                fill={
                  isHighlight
                    ? 'rgba(59,130,246,0.25)'
                    : isTerminal
                      ? 'rgba(16,185,129,0.12)'
                      : 'var(--bg-card)'
                }
                stroke={
                  isHighlight
                    ? 'var(--accent-cyan)'
                    : isTerminal
                      ? 'var(--accent-green)'
                      : 'var(--accent-blue)'
                }
                strokeWidth={isHighlight ? 2.5 : 1.5}
              />
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={FONT_SIZE}
                fontFamily="var(--font-mono)"
                fontWeight={600}
                fill={
                  isHighlight
                    ? 'var(--accent-cyan)'
                    : isTerminal
                      ? 'var(--accent-green)'
                      : 'var(--text-primary)'
                }
              >
                {pos.label}
              </text>
              {showValues && pos.value !== undefined && pos.value !== null && (
                <text
                  x={pos.x}
                  y={pos.y + NODE_RADIUS + 14}
                  textAnchor="middle"
                  fontSize={VAL_FONT_SIZE}
                  fontFamily="var(--font-mono)"
                  fontWeight={700}
                  fill="var(--accent-amber)"
                >
                  .val={pos.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
