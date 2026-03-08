"use client";

import { useMemo, useState } from "react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import { motion, useReducedMotion } from "motion/react";
import type { GraphEdge, GraphNode } from "@/lib/content";

type PositionedNode = GraphNode &
  SimulationNodeDatum & {
    x: number;
    y: number;
  };

type SimulatedLink = GraphEdge & SimulationLinkDatum<PositionedNode>;

export function GraphCanvas({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const positionedNodes = useMemo(() => {
    if (nodes.length === 0) {
      return [];
    }

    const width = 920;
    const height = 560;
    const simulatedNodes: PositionedNode[] = nodes.map((node, index) => ({
      ...node,
      x: 160 + (index % 4) * 180,
      y: 100 + Math.floor(index / 4) * 110,
    }));
    const simulatedLinks: SimulatedLink[] = edges.map((edge) => ({ ...edge }));

    const simulation = forceSimulation(simulatedNodes)
      .force("charge", forceManyBody<PositionedNode>().strength(-140))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collision", forceCollide<PositionedNode>(36))
      .force(
        "link",
        forceLink<PositionedNode, SimulatedLink>(simulatedLinks)
          .id((node) => node.id)
          .distance((link) => (link.kind === "related" ? 120 : 88))
          .strength((link) => (link.kind === "related" ? 0.28 : 0.46)),
      );

    const ticks = prefersReducedMotion ? 24 : 90;
    for (let step = 0; step < ticks; step += 1) {
      simulation.tick();
    }
    simulation.stop();

    return simulatedNodes.map((node) => ({
      ...node,
      x: Math.max(44, Math.min(width - 44, node.x ?? width / 2)),
      y: Math.max(44, Math.min(height - 44, node.y ?? height / 2)),
    }));
  }, [edges, nodes, prefersReducedMotion]);

  const nodeMap = useMemo(
    () => new Map(positionedNodes.map((node) => [node.id, node])),
    [positionedNodes],
  );

  const activeNode = activeNodeId ? nodeMap.get(activeNodeId) : null;

  return (
    <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Interactive graph
          </p>
          <h2 className="mt-2 font-serif text-4xl tracking-tight text-[var(--foreground)]">
            Link structure, not just a node count
          </h2>
        </div>
        <div className="max-w-sm rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--muted)]">
          {activeNode ? (
            <>
              <span className="block font-semibold text-[var(--foreground)]">{activeNode.title}</span>
              <span>{activeNode.group}</span>
            </>
          ) : (
            <span>Hover a node to inspect the note cluster and its relationship context.</span>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-[1.6rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(17,24,39,0.03),rgba(17,24,39,0.08))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.05))]">
        <svg viewBox="0 0 920 560" className="h-auto w-full">
          {edges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) {
              return null;
            }

            const isActive = activeNodeId === edge.source || activeNodeId === edge.target;

            return (
              <line
                key={`${edge.source}-${edge.target}-${edge.kind}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={isActive ? "rgba(37,99,235,0.52)" : "rgba(102,112,133,0.22)"}
                strokeWidth={edge.kind === "related" ? 1.2 : 1.8}
              />
            );
          })}
          {positionedNodes.map((node, index) => (
            <motion.g
              key={node.id}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, delay: index * 0.015 }}
              onMouseEnter={() => setActiveNodeId(node.id)}
              onMouseLeave={() => setActiveNodeId(null)}
            >
              <a href={`/docs/${node.slug}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={activeNodeId === node.id ? 18 : 14}
                  fill={activeNodeId === node.id ? "#2563eb" : "#111827"}
                  opacity={activeNodeId && activeNodeId !== node.id ? 0.64 : 0.92}
                />
                <text
                  x={node.x}
                  y={node.y + 32}
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-[var(--muted)] text-[11px] font-medium"
                >
                  {node.title}
                </text>
              </a>
            </motion.g>
          ))}
        </svg>
      </div>
    </div>
  );
}
