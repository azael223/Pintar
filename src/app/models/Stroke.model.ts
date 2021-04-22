import { ToolType } from "./toolType";

export interface Stroke {
  type: keyof typeof ToolType;
  areaAxes?: { x: number; y: number }[];
  zIndex?: number;
  height: number;
  color: string;
  positionAxes?: { x: number; y: number };
}
