"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpTooltip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const HelpOutline_1 = __importDefault(require("@mui/icons-material/HelpOutline"));
const HelpTooltip = ({ title }) => ((0, jsx_runtime_1.jsx)(material_1.Tooltip, { title: title, placement: "top", arrow: true, children: (0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "small", sx: { ml: 0.5 }, children: (0, jsx_runtime_1.jsx)(HelpOutline_1.default, { fontSize: "small" }) }) }));
exports.HelpTooltip = HelpTooltip;
