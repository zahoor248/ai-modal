"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // modern fork of react-beautiful-dnd
import { Button } from "@/components/ui/button";

// Templates
const templates = [
  { id: "classic", name: "Classic", font: "Times", style: "Normal" },
  { id: "modern", name: "Modern", font: "Helvetica", style: "Bold" },
  { id: "vintage", name: "Vintage", font: "Courier", style: "Italic" },
  { id: "colorful", name: "Colorful", font: "Helvetica", style: "Bold" },
];

interface StorySection {
  id: string;
  content: string;
}

interface PDFBuilderProps {
  story: string;
  title: string;
}

export function PDFBuilder({ story }: PDFBuilderProps) {
  // Split story into sections by paragraph
  const initialSections: StorySection[] = story
    .split("\n\n")
    .map((p, index) => ({ id: `section-${index}`, content: p }));

  const [storySections, setStorySections] = useState(initialSections);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);

  // Update paragraph content
  const handleUpdateSection = (index: number, value: string) => {
    const newSections = [...storySections];
    newSections[index].content = value;
    setStorySections(newSections);
  };

  // Handle drag & drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(storySections);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setStorySections(items);
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let y = 60;

    // Apply template styles
    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    // Title
    doc.setFont(template.font as any, template.style as any);
    doc.setFontSize(24);
    doc.text("Your Story", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += 40;

    // Paragraphs
    doc.setFontSize(12);
    storySections.forEach((section) => {
      const lines = doc.splitTextToSize(section.content, maxWidth);
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.getHeight() - 60) {
          doc.addPage();
          y = 60;
        }
        doc.text(line, margin, y);
        y += 14;
      });
      y += 10; // spacing between paragraphs
    });

    doc.save(`story-${selectedTemplate}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Template Selector */}
      <div className="flex gap-4 mb-6">
        {templates.map((t) => (
          <button
            key={t.id}
            className={`px-4 py-2 rounded ${
              selectedTemplate === t.id
                ? "bg-primary text-white shadow-lg"
                : "bg-card border"
            } transition-all hover:scale-105`}
            onClick={() => setSelectedTemplate(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Drag & Drop Sections */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="story">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {storySections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 bg-card rounded shadow transition-all ${
                        snapshot.isDragging ? "scale-105 shadow-xl" : ""
                      }`}
                    >
                      <textarea
                        className="w-full border-none focus:ring-0 bg-transparent resize-none text-sm"
                        value={section.content}
                        onChange={(e) => handleUpdateSection(index, e.target.value)}
                        rows={Math.max(2, section.content.split("\n").length)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Generate PDF */}
      <Button
        className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded shadow-lg hover:scale-105 transition-transform"
        onClick={handleGeneratePDF}
      >
        Generate PDF
      </Button>
    </div>
  );
}
