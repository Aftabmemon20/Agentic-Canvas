"use client";
import { useEffect, useState, useMemo } from "react";
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, MarkerType, Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { motion } from "framer-motion";

const COLORS: Record<string, { fill: string; stroke: string; text: string; glow: string }> = {
  blue: { fill: "#E6F1FB", stroke: "#185FA5", text: "#0C447C", glow: "#378ADD" },
  teal: { fill: "#E1F5EE", stroke: "#0F6E56", text: "#085041", glow: "#1D9E75" },
  amber: { fill: "#FAEEDA", stroke: "#854F0B", text: "#633806", glow: "#BA7517" },
  purple: { fill: "#EEEDFE", stroke: "#534AB7", text: "#3C3489", glow: "#7F77DD" },
  coral: { fill: "#FAECE7", stroke: "#993C1D", text: "#712B13", glow: "#D85A30" },
  green: { fill: "#EAF3DE", stroke: "#3B6D11", text: "#27500A", glow: "#639922" },
};

// Custom Node to support framer-motion pulses and dynamic coloring
const CustomNode = ({ data }: { data: any }) => {
  const c = COLORS[data.color || "blue"] || COLORS.blue;
  const isHighlighted = data.isHighlighted;
  const isPulsing = data.isPulsing;

  return (
    <>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <motion.div
        animate={{
          scale: isPulsing ? [1, 1.05, 1] : 1,
          boxShadow: isHighlighted ? `0 0 25px ${c.glow}` : "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
        }}
        transition={{ duration: 0.6, repeat: isPulsing ? Infinity : 0 }}
        className="px-5 py-3 rounded-xl border-2 backdrop-blur-md w-[200px]"
        style={{ backgroundColor: `${c.fill}F0`, borderColor: c.stroke, color: c.text }}
      >
        <div className="font-bold text-base text-center tracking-tight leading-snug">{data.label}</div>
        {data.sublabel && <div className="text-xs text-center opacity-90 mt-1.5 font-medium leading-tight">{data.sublabel}</div>}
      </motion.div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === "LR" ? "left" : "top";
    node.sourcePosition = direction === "LR" ? "right" : "bottom";
    node.position = {
      x: nodeWithPosition.x - 220 / 2,
      y: nodeWithPosition.y - 80 / 2,
    };
    return node;
  });

  return { nodes, edges };
};

export default function DynamicRenderer({ data }: { data: any }) {
  const rawNodes = data.nodes || [];
  const rawEdges = data.edges || [];
  const animations = data.animations || [];

  const initialNodes = rawNodes.map((n: any) => ({
    id: String(n.id),
    type: "custom",
    data: { ...n, isHighlighted: false, isPulsing: false },
    position: { x: 0, y: 0 },
  }));

  const initialEdges = rawEdges.map((e: any) => ({
    id: e.id || `e${e.from}-${e.to}`,
    source: String(e.from),
    target: String(e.to),
    label: e.label,
    animated: false,
    style: { stroke: "#64748B", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#64748B" },
  }));

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
    "TB"
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [currentAnimText, setCurrentAnimText] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying || animations.length === 0) return;

    let timeoutIds: NodeJS.Timeout[] = [];
    
    const playAnimations = () => {
      // Reset all
      setNodes((nds) =>
        nds.map((n) => ({ ...n, data: { ...n.data, isHighlighted: false, isPulsing: false } }))
      );
      setEdges((eds) => eds.map((e) => ({ ...e, animated: false, style: { stroke: "#64748B", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#64748B" } })));
      setCurrentAnimText("");

      animations.forEach((anim: any) => {
        const t = setTimeout(() => {
          if (anim.description) setCurrentAnimText(anim.description);

          if (anim.action === "highlight" || anim.action === "pulse") {
            setNodes((nds) =>
              nds.map((n) => {
                if (n.id === String(anim.target)) {
                  return {
                    ...n,
                    data: { ...n.data, isHighlighted: anim.action === "highlight", isPulsing: anim.action === "pulse" },
                  };
                }
                return n;
              })
            );
          }

          if (anim.action === "flow") {
            setEdges((eds) =>
              eds.map((e) => {
                if (e.id === String(anim.target) || (e.source === String(anim.from) && e.target === String(anim.to))) {
                  return { ...e, animated: true, style: { stroke: "#3B82F6", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3B82F6" } };
                }
                return e;
              })
            );
          }
        }, anim.timestamp);
        timeoutIds.push(t);
      });

      // Loop after last animation finishes
      const maxTime = Math.max(...animations.map((a: any) => a.timestamp || 0)) + 3000;
      const t = setTimeout(() => {
        playAnimations();
      }, maxTime);
      timeoutIds.push(t);
    };

    playAnimations();

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [isPlaying, animations]);

  return (
    <div className="space-y-4">
      {currentAnimText && (
        <div className="bg-slate-900 border border-slate-800 text-slate-200 px-4 py-2.5 rounded-lg text-sm font-mono flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          {currentAnimText}
        </div>
      )}
      
      <div className="h-[600px] w-full bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-200/60 relative shadow-inner backdrop-blur-sm">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#ccc" gap={16} />
          <Controls />
        </ReactFlow>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white px-3 py-1.5 rounded-md shadow-sm border border-slate-200 text-xs font-bold text-slate-700 z-10 transition-colors"
        >
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>
      </div>
    </div>
  );
}
