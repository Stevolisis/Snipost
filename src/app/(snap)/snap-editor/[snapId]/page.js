"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Line, Arrow, Transformer } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Image as ImageIcon, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  Code2, 
  Layers, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Copy, 
  Undo2, 
  Redo2, 
  HelpCircle,
  Layout,
  Pen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Palette,
  ImagePlus,
  ShieldAlertIcon
} from 'lucide-react';
// import { useImage } from 'react-konva-utils';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

const SnapEditor = () => {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [showShadow, setShowShadow] = useState(false);
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [artboards, setArtboards] = useState([{ id: 1, width: 800, height: 600 }]);
  const [activeArtboard, setActiveArtboard] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Update transformer when selected element changes
  useEffect(() => {
    if (!transformerRef.current) return;
    
    const node = stageRef.current.findOne(`.${selectedId}`);
    if (node) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Handle text editing
  useEffect(() => {
    if (activeTool === 'text' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeTool]);

  // Save to history
  const saveToHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  // Handle stage click
  const handleStageClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
      return;
    }

    if (activeTool === 'select') {
      setSelectedId(e.target.name());
    } else if (activeTool === 'pen') {
      const pos = e.currentTarget.getPointerPosition();
      const newLine = {
        id: `line-${Date.now()}`,
        type: 'line',
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke: color,
        strokeWidth,
        shadowBlur: showShadow ? shadowBlur : 0,
        shadowColor: showShadow ? shadowColor : 'transparent'
      };
      setElements([...elements, newLine]);
      saveToHistory([...elements, newLine]);
    }
  };

  // Handle stage mouse move for pen tool
  const handleStageMouseMove = (e) => {
    if (activeTool !== 'pen') return;
    
    const stage = e.currentTarget;
    const point = stage.getPointerPosition();
    const lastLine = elements[elements.length - 1];
    
    if (lastLine && lastLine.type === 'line') {
      lastLine.points = lastLine.points.slice(0, 2).concat([point.x, point.y]);
      setElements(elements.slice(0, -1).concat(lastLine));
    }
  };

  // Handle adding shapes
  const addShape = (type) => {
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    
    const newShape = {
      id: `${type}-${Date.now()}`,
      key: `${type}-${Date.now()}`,
      type,
      x: pos.x,
      y: pos.y,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      fill: type === 'text' ? 'transparent' : color,
      stroke: type === 'text' ? color : 'transparent',
      strokeWidth: type === 'text' ? 0 : strokeWidth,
      fontSize,
      fontFamily,
      text: type === 'text' ? 'Double click to edit' : '',
      shadowBlur: showShadow ? shadowBlur : 0,
      shadowColor: showShadow ? shadowColor : 'transparent'
    };
    
    setElements([...elements, newShape]);
    saveToHistory([...elements, newShape]);
    setSelectedId(newShape.id);
    setActiveTool('select');
    
    if (type === 'text') {
      setTimeout(() => {
        const node = stage.findOne(`.${newShape.id}`);
        node.hide();
        setActiveTool('text');
        setText('Double click to edit');
      }, 50);
    }
  };

  // Handle text editing
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextBlur = () => {
    const selectedElement = elements.find(el => el.id === selectedId);
    if (selectedElement) {
      const updatedElements = elements.map(el => {
        if (el.id === selectedId) {
          return { ...el, text };
        }
        return el;
      });
      setElements(updatedElements);
      saveToHistory(updatedElements);
    }
    setActiveTool('select');
    
    const node = stageRef.current.findOne(`.${selectedId}`);
    if (node) {
      node.show();
      stageRef.current.batchDraw();
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        
        const newImage = {
          id: `image-${Date.now()}`,
          key: `image-${Date.now()}`,
          type: 'image',
          x: pos.x,
          y: pos.y,
          width: img.width / 2,
          height: img.height / 2,
          image: img,
          shadowBlur: showShadow ? shadowBlur : 0,
          shadowColor: showShadow ? shadowColor : 'transparent'
        };
        
        setElements([...elements, newImage]);
        saveToHistory([...elements, newImage]);
        setSelectedId(newImage.id);
        setActiveTool('select');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle image URL import
  const handleImageUrlImport = () => {
    if (!imageUrl) return;
    
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const stage = stageRef.current;
      const pos = stage.getPointerPosition();
      
      const newImage = {
        id: `image-${Date.now()}`,
        type: 'image',
        x: pos.x,
        y: pos.y,
        width: img.width / 2,
        height: img.height / 2,
        image: img,
        shadowBlur: showShadow ? shadowBlur : 0,
        shadowColor: showShadow ? shadowColor : 'transparent'
      };
      
      setElements([...elements, newImage]);
      saveToHistory([...elements, newImage]);
      setSelectedId(newImage.id);
      setActiveTool('select');
      setImageUrl('');
    };
    img.onerror = () => {
      toast.error('Failed to load image from URL');
    };
    img.src = imageUrl;
  };

  // Handle export
  const handleExport = () => {
    if (!stageRef.current) return;
    
    const dataURL = stageRef.current.toDataURL({
      quality: 1,
      pixelRatio: 2
    });
    
    const link = document.createElement('a');
    link.download = 'snap-editor-export.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle copy
  const handleCopy = () => {
    if (!selectedId) return;
    
    const selectedElement = elements.find(el => el.id === selectedId);
    if (!selectedElement) return;
    
    const newElement = {
      ...selectedElement,
      id: `${selectedElement.type}-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20
    };
    
    setElements([...elements, newElement]);
    saveToHistory([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  // Handle delete
  const handleDelete = () => {
    if (!selectedId) return;
    
    const updatedElements = elements.filter(el => el.id !== selectedId);
    setElements(updatedElements);
    saveToHistory(updatedElements);
    setSelectedId(null);
  };

  // Handle zoom
  const handleZoom = (direction) => {
    const newScale = direction === 'in' ? scale * 1.2 : scale / 1.2;
    setScale(Math.max(0.1, Math.min(newScale, 5)));
  };

  // Get selected element
  const selectedElement = elements.find(el => el.id === selectedId);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Toolbar */}
      <div className="border-b p-2 px-3 flex items-center justify-between">
        <Link href="/start">
          <div className="text-xl font-bold text-white flex gap-x-1 items-center">
            <Image
              src="/logo.svg"
              alt="Snipost Logo"
              width={22}
              height={22}
            />
            <h2 className='text-lg text-primary'>Snipost</h2>
          </div>        
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-16 border-r p-2 flex flex-col items-center gap-4 overflow-y-auto!">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === 'select' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setActiveTool('select')}
                >
                  <Move className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Select (V)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === 'pen' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setActiveTool('pen')}
                >
                  <Pen className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Pen (P)</TooltipContent>
            </Tooltip>

            <Separator />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => addShape('rect')}>
                  <Square className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Rectangle (R)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => addShape('circle')}>
                  <CircleIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Circle (C)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => addShape('text')}>
                  <Type className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Text (T)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => addShape('arrow')}>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Arrow (A)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current.click()}>
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Image (I)</TooltipContent>
            </Tooltip>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <Separator />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleZoom('in')}>
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Zoom In (+)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleZoom('out')}>
                  <ZoomOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Zoom Out (-)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-auto bg-muted flex items-center justify-center p-4">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.1s ease'
            }}
          >
            <Stage
              ref={stageRef}
              width={800}
              height={600}
              onClick={handleStageClick}
              onMouseMove={handleStageMouseMove}
              className="bg-white shadow-lg"
            >
              <Layer>
                {elements.map((element) => {
                  const commonProps = {
                    key: element.id,
                    name: element.id,
                    draggable: activeTool === 'select',
                    onClick: (e) => {
                      e.cancelBubble = true;
                      setSelectedId(element.id);
                    },
                    onDragEnd: (e) => {
                      const updatedElements = elements.map((el) => {
                        if (el.id === element.id) {
                          return {
                            ...el,
                            x: e.target.x(),
                            y: e.target.y()
                          };
                        }
                        return el;
                      });
                      setElements(updatedElements);
                      saveToHistory(updatedElements);
                    },
                    onTransformEnd: () => {
                      const node = stageRef.current.findOne(`.${element.id}`);
                      const updatedElements = elements.map((el) => {
                        if (el.id === element.id) {
                          return {
                            ...el,
                            x: node.x(),
                            y: node.y(),
                            width: node.width() * node.scaleX(),
                            height: node.height() * node.scaleY(),
                            rotation: node.rotation()
                          };
                        }
                        return el;
                      });
                      setElements(updatedElements);
                      saveToHistory(updatedElements);
                      node.scaleX(1);
                      node.scaleY(1);
                    }
                  };

                  switch (element.type) {
                    case 'rect':
                      return (
                        <Rect
                          {...commonProps}
                          key={element.key}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          shadowBlur={element.shadowBlur}
                          shadowColor={element.shadowColor}
                          rotation={element.rotation}
                        />
                      );
                    case 'circle':
                      return (
                        <Circle
                          {...commonProps}
                          key={element.key}
                          x={element.x}
                          y={element.y}
                          radius={element.width / 2}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          shadowBlur={element.shadowBlur}
                          shadowColor={element.shadowColor}
                          rotation={element.rotation}
                        />
                      );
                    case 'text':
                      return (
                        <Text
                          {...commonProps}
                          key={element.key}
                          x={element.x}
                          y={element.y}
                          text={element.text}
                          fontSize={element.fontSize}
                          fontFamily={element.fontFamily}
                          fill={element.stroke}
                          width={element.width}
                          height={element.height}
                          shadowBlur={element.shadowBlur}
                          shadowColor={element.shadowColor}
                          rotation={element.rotation}
                          onDblClick={() => {
                            setSelectedId(element.id);
                            setText(element.text);
                            setActiveTool('text');
                            const node = stageRef.current.findOne(`.${element.id}`);
                            node.hide();
                          }}
                        />
                      );
                    case 'image':
                      return (
                        <KonvaImage
                          {...commonProps}
                          key={element.key}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          image={element.image}
                          shadowBlur={element.shadowBlur}
                          shadowColor={element.shadowColor}
                          rotation={element.rotation}
                        />
                      );
                    case 'line':
                      return (
                        <Line
                          {...commonProps}
                          key={element.key}
                          points={element.points}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          shadowBlur={element.shadowBlur}
                          shadowColor={element.shadowColor}
                          rotation={element.rotation}
                        />
                      );
                    case 'arrow':
                      return (
                        <Arrow
                          {...commonProps}
                          key={element.key}
                          x={element.x}
                          y={element.y}
                          points={[0, 0, element.width, 0]}
                          pointerLength={10}
                          pointerWidth={10}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          shadowBlur={element.shadowBlur}
                          shadowColor={element.shadowColor}
                          rotation={element.rotation}
                        />
                      );
                    default:
                      return null;
                  }
                })}
                <Transformer ref={transformerRef} />
              </Layer>
            </Stage>
          </div>

          {/* Text editing overlay */}
          {activeTool === 'text' && selectedId && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
              <div
                className="pointer-events-auto p-2 bg-white shadow-lg rounded-md"
                style={{
                  position: 'absolute',
                  left: selectedElement?.x * scale + 20,
                  top: selectedElement?.y * scale + 20,
                  width: selectedElement?.width * scale,
                  zIndex: 1000
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={handleTextChange}
                  onBlur={handleTextBlur}
                  className="w-full h-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{
                    fontSize: `${selectedElement?.fontSize * scale}px`,
                    fontFamily: selectedElement?.fontFamily,
                    color: selectedElement?.stroke
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Inspector */}
        <div className="w-64 border-l p-4 overflow-y-auto">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              {selectedElement ? (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Type</Label>
                    <Input value={selectedElement.type} readOnly />
                  </div>

                  {['rect', 'circle', 'arrow', 'pen'].includes(selectedElement.type) && (
                    <>
                      <div>
                        <Label>Fill Color</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-4 w-4 rounded border" 
                                  style={{ backgroundColor: selectedElement.fill }}
                                />
                                <span>{selectedElement.fill}</span>
                              </div>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <HexColorPicker
                              color={selectedElement.fill}
                              onChange={(newColor) => {
                                const updatedElements = elements.map((el) => {
                                  if (el.id === selectedId) {
                                    return { ...el, fill: newColor };
                                  }
                                  return el;
                                });
                                setElements(updatedElements);
                                saveToHistory(updatedElements);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Stroke Width</Label>
                        <Slider
                          value={[selectedElement.strokeWidth]}
                          onValueChange={(value) => {
                            const updatedElements = elements.map((el) => {
                              if (el.id === selectedId) {
                                return { ...el, strokeWidth: value[0] };
                              }
                              return el;
                            });
                            setElements(updatedElements);
                            saveToHistory(updatedElements);
                          }}
                          min={1}
                          max={20}
                          step={1}
                        />
                      </div>
                    </>
                  )}

                  {selectedElement.type === 'text' && (
                    <>
                      <div>
                        <Label>Text Color</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-4 w-4 rounded border" 
                                  style={{ backgroundColor: selectedElement.stroke }}
                                />
                                <span>{selectedElement.stroke}</span>
                              </div>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <HexColorPicker
                              color={selectedElement.stroke}
                              onChange={(newColor) => {
                                const updatedElements = elements.map((el) => {
                                  if (el.id === selectedId) {
                                    return { ...el, stroke: newColor };
                                  }
                                  return el;
                                });
                                setElements(updatedElements);
                                saveToHistory(updatedElements);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Font Size</Label>
                        <Slider
                          value={[selectedElement.fontSize]}
                          onValueChange={(value) => {
                            const updatedElements = elements.map((el) => {
                              if (el.id === selectedId) {
                                return { ...el, fontSize: value[0] };
                              }
                              return el;
                            });
                            setElements(updatedElements);
                            saveToHistory(updatedElements);
                          }}
                          min={8}
                          max={72}
                          step={1}
                        />
                      </div>

                      <div>
                        <Label>Font Family</Label>
                        <select
                          value={selectedElement.fontFamily}
                          onChange={(e) => {
                            const updatedElements = elements.map((el) => {
                              if (el.id === selectedId) {
                                return { ...el, fontFamily: e.target.value };
                              }
                              return el;
                            });
                            setElements(updatedElements);
                            saveToHistory(updatedElements);
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Shadow</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedElements = elements.map((el) => {
                            if (el.id === selectedId) {
                              return {
                                ...el,
                                shadowBlur: el.shadowBlur ? 0 : shadowBlur,
                                shadowColor: el.shadowBlur ? 'transparent' : shadowColor
                              };
                            }
                            return el;
                          });
                          setElements(updatedElements);
                          saveToHistory(updatedElements);
                        }}
                      >
                        {selectedElement.shadowBlur ? (
                          <>
                            <ShieldAlertIcon className="h-4 w-4 mr-2" />
                            Remove
                          </>
                        ) : (
                          <>
                            <ShieldAlertIcon className="h-4 w-4 mr-2" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>

                    {selectedElement.shadowBlur > 0 && (
                      <>
                        <div>
                          <Label>Shadow Color</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="h-4 w-4 rounded border" 
                                    style={{ backgroundColor: selectedElement.shadowColor }}
                                  />
                                  <span>{selectedElement.shadowColor}</span>
                                </div>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <HexColorPicker
                                color={selectedElement.shadowColor}
                                onChange={(newColor) => {
                                  const updatedElements = elements.map((el) => {
                                    if (el.id === selectedId) {
                                      return { ...el, shadowColor: newColor };
                                    }
                                    return el;
                                  });
                                  setElements(updatedElements);
                                  saveToHistory(updatedElements);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label>Shadow Blur</Label>
                          <Slider
                            value={[selectedElement.shadowBlur]}
                            onValueChange={(value) => {
                              const updatedElements = elements.map((el) => {
                                if (el.id === selectedId) {
                                  return { ...el, shadowBlur: value[0] };
                                }
                                return el;
                              });
                              setElements(updatedElements);
                              saveToHistory(updatedElements);
                            }}
                            min={0}
                            max={50}
                            step={1}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="h-8 w-8 mx-auto mb-2" />
                  <p>Select an element to edit its properties</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="layers">
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Layers</Label>
                  <Button variant="ghost" size="sm" onClick={() => setElements([])}>
                    Clear All
                  </Button>
                </div>

                <ScrollArea className="h-64 rounded-md border">
                  {elements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Layers className="h-8 w-8 mx-auto mb-2" />
                      <p>No layers yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {[...elements].reverse().map((element) => (
                        <div
                          key={element.id}
                          className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                            selectedId === element.id ? 'bg-accent' : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedId(element.id)}
                        >
                          <div className="flex items-center gap-2">
                            {element.type === 'rect' && <Square className="h-4 w-4" />}
                            {element.type === 'circle' && <CircleIcon className="h-4 w-4" />}
                            {element.type === 'text' && <Type className="h-4 w-4" />}
                            {element.type === 'image' && <ImageIcon className="h-4 w-4" />}
                            {element.type === 'line' && <Pen className="h-4 w-4" />}
                            {element.type === 'arrow' && <ArrowRight className="h-4 w-4" />}
                            <span className="capitalize">{element.type}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedElements = elements.filter(el => el.id !== element.id);
                              setElements(updatedElements);
                              saveToHistory(updatedElements);
                              if (selectedId === element.id) {
                                setSelectedId(null);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="border-t p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex === 0}>
            <Undo2 className="h-4 w-4 mr-2" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
          >
            <Redo2 className="h-4 w-4 mr-2" />
            Redo
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <ImagePlus className="h-4 w-4 mr-2" />
                Import Image
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label>From URL</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <Button onClick={handleImageUrlImport}>Import</Button>
                  </div>
                </div>
                <div className="text-center text-muted-foreground">or</div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload from device
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm">
            <Layout className="h-4 w-4 mr-2" />
            Artboards
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SnapEditor;