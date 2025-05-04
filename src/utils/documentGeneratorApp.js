// src/utils/documentGenerators.js
import jsPDF from 'jspdf';
import * as docx from 'docx';
import { saveAs } from 'file-saver';
import pptxgen from 'pptxgenjs';

// Helper function to parse modules from Claude response
function parseModules(content) {
  // This is a simplified parser - you'll need to adapt based on Claude's response format
  return [
    {
      title: 'Foundation & Introduction',
      content: 'Understanding the core principles...',
      activities: ['Interactive demonstration', 'Group discussion'],
      learningObjectives: ['Define key concepts', 'Identify main applications'],
    },
    // Add more modules as needed
  ];
}

// Helper function to parse assessments from Claude response
function parseAssessments(content) {
  // This is a simplified parser - you'll need to adapt based on Claude's response format
  return [
    'Knowledge check quiz',
    'Practical demonstration',
    'Case study analysis',
    'Final project presentation',
  ];
}

// PDF Generation
export function generatePDF(courseData) {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(courseData.title, 20, yPosition);
  yPosition += 15;
  
  // Course details
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Audience: ${courseData.audience}`, 20, yPosition);
  doc.text(`Duration: ${courseData.sessionLength} minutes`, 20, yPosition + 8);
  doc.text(`Format: ${courseData.deliveryFormat}`, 20, yPosition + 16);
  yPosition += 35;
  
  // Modules
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Course Modules', 20, yPosition);
  yPosition += 10;
  
  courseData.modules.forEach((module, index) => {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Module ${index + 1}: ${module.title}`, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const contentLines = doc.splitTextToSize(module.content, 170);
    contentLines.forEach(line => {
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    if (module.activities) {
      doc.text('Activities:', 20, yPosition);
      yPosition += 6;
      module.activities.forEach(activity => {
        doc.text(`• ${activity}`, 25, yPosition);
        yPosition += 6;
      });
    }
    yPosition += 10;
    
    // Check if we need a new page
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // Assessments
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Assessment Methods', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  courseData.assessments.forEach(assessment => {
    doc.text(`• ${assessment}`, 20, yPosition);
    yPosition += 7;
  });
  
  doc.save(`${courseData.topic}-course-materials.pdf`);
}

// DOCX Generation
export function generateDOCX(courseData) {
  const children = [
    new docx.Paragraph({
      text: courseData.title,
      heading: docx.HeadingLevel.HEADING_1,
      alignment: docx.AlignmentType.CENTER,
    }),
    new docx.Paragraph({
      text: `Audience: ${courseData.audience}`,
      spacing: { after: 200 },
    }),
    new docx.Paragraph({
      text: `Duration: ${courseData.sessionLength} minutes`,
      spacing: { after: 200 },
    }),
    new docx.Paragraph({
      text: `Format: ${courseData.deliveryFormat}`,
      spacing: { after: 400 },
    }),
    new docx.Paragraph({
      text: 'Course Modules',
      heading: docx.HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),
  ];

  courseData.modules.forEach((module, index) => {
    children.push(
      new docx.Paragraph({
        text: `Module ${index + 1}: ${module.title}`,
        heading: docx.HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 200 },
      }),
      new docx.Paragraph({
        text: module.content,
        spacing: { after: 200 },
      })
    );

    if (module.learningObjectives && module.learningObjectives.length > 0) {
      children.push(
        new docx.Paragraph({
          text: 'Learning Objectives:',
          bold: true,
          spacing: { before: 200, after: 100 },
        })
      );
      
      module.learningObjectives.forEach(objective => {
        children.push(
          new docx.Paragraph({
            text: `• ${objective}`,
            indent: { left: 400 },
          })
        );
      });
    }

    if (module.activities && module.activities.length > 0) {
      children.push(
        new docx.Paragraph({
          text: 'Activities:',
          bold: true,
          spacing: { before: 200, after: 100 },
        })
      );
      
      module.activities.forEach(activity => {
        children.push(
          new docx.Paragraph({
            text: `• ${activity}`,
            indent: { left: 400 },
          })
        );
      });
    }
  });

  children.push(
    new docx.Paragraph({
      text: 'Assessment Methods',
      heading: docx.HeadingLevel.HEADING_2,
      spacing: { before: 600, after: 200 },
    })
  );

  courseData.assessments.forEach(assessment => {
    children.push(
      new docx.Paragraph({
        text: `• ${assessment}`,
        indent: { left: 400 },
      })
    );
  });

  const doc = new docx.Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${courseData.topic}-course-materials.docx`);
  });
}

// PowerPoint Generation
export function generateSlides(courseData) {
  const pptx = new pptxgen();
  
  // Theme colors
  const theme = {
    primary: '0EA5E9',
    accent: 'EC4899',
    text: '334155',
    textLight: '64748B',
  };
  
  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { fill: theme.primary };
  
  titleSlide.addText(courseData.title, {
    x: 0.5,
    y: '40%',
    w: '90%',
    h: 1.5,
    align: 'center',
    fontSize: 44,
    color: 'FFFFFF',
    bold: true,
    fontFace: 'Arial',
  });
  
  titleSlide.addText(`${courseData.audience} | ${courseData.sessionLength} min | ${courseData.deliveryFormat}`, {
    x: 0.5,
    y: '55%',
    w: '90%',
    h: 0.5,
    align: 'center',
    fontSize: 24,
    color: 'FFFFFF',
    fontFace: 'Arial',
  });
  
  // Course overview slide
  const overviewSlide = pptx.addSlide();
  overviewSlide.addText('Course Overview', {
    x: 0.5,
    y: 0.5,
    w: '90%',
    h: 0.7,
    fontSize: 36,
    color: theme.text,
    bold: true,
  });
  
  const overviewBullets = courseData.modules.map((module, idx) => 
    `Module ${idx + 1}: ${module.title}`
  );
  
  overviewSlide.addText(overviewBullets, {
    x: 0.5,
    y: 1.5,
    w: '90%',
    h: 4,
    fontSize: 24,
    color: theme.text,
    bullet: true,
  });
  
  // Module slides
  courseData.modules.forEach((module, index) => {
    // Module title slide
    const moduleSlide = pptx.addSlide();
    moduleSlide.addText(`Module ${index + 1}`, {
      x: 0.5,
      y: 0.5,
      w: '90%',
      h: 0.7,
      fontSize: 32,
      color: theme.accent,
      bold: true,
    });
    
    moduleSlide.addText(module.title, {
      x: 0.5,
      y: 1.3,
      w: '90%',
      h: 1.5,
      fontSize: 36,
      color: theme.text,
      bold: true,
    });
    
    // Module content slide
    const contentSlide = pptx.addSlide();
    contentSlide.addText(module.title, {
      x: 0.5,
      y: 0.5,
      w: '90%',
      h: 0.7,
      fontSize: 32,
      color: theme.text,
      bold: true,
    });
    
    contentSlide.addText(module.content, {
      x: 0.5,
      y: 1.5,
      w: '90%',
      h: 3,
      fontSize: 20,
      color: theme.text,
    });
    
    // Learning objectives slide
    if (module.learningObjectives && module.learningObjectives.length > 0) {
      const objectivesSlide = pptx.addSlide();
      objectivesSlide.addText('Learning Objectives', {
        x: 0.5,
        y: 0.5,
        w: '90%',
        h: 0.7,
        fontSize: 32,
        color: theme.text,
        bold: true,
      });
      
      objectivesSlide.addText(module.learningObjectives, {
        x: 0.5,
        y: 1.5,
        w: '90%',
        h: 4,
        fontSize: 24,
        color: theme.text,
        bullet: true,
      });
    }
    
    // Activities slide
    if (module.activities && module.activities.length > 0) {
      const activitiesSlide = pptx.addSlide();
      activitiesSlide.addText('Activities', {
        x: 0.5,
        y: 0.5,
        w: '90%',
        h: 0.7,
        fontSize: 32,
        color: theme.text,
        bold: true,
      });
      
      activitiesSlide.addText(module.activities, {
        x: 0.5,
        y: 1.5,
        w: '90%',
        h: 4,
        fontSize: 24,
        color: theme.text,
        bullet: true,
      });
    }
  });
  
  // Assessment slide
  const assessmentSlide = pptx.addSlide();
  assessmentSlide.addText('Assessment Methods', {
    x: 0.5,
    y: 0.5,
    w: '90%',
    h: 0.7,
    fontSize: 36,
    color: theme.text,
    bold: true,
  });
  
  assessmentSlide.addText(courseData.assessments, {
    x: 0.5,
    y: 1.5,
    w: '90%',
    h: 4,
    fontSize: 24,
    color: theme.text,
    bullet: true,
  });
  
  // Thank you slide
  const thankYouSlide = pptx.addSlide();
  thankYouSlide.background = { fill: theme.primary };
  
  thankYouSlide.addText('Thank You', {
    x: 0.5,
    y: '40%',
    w: '90%',
    h: 1.5,
    align: 'center',
    fontSize: 44,
    color: 'FFFFFF',
    bold: true,
    fontFace: 'Arial',
  });
  
  thankYouSlide.addText('Questions & Discussion', {
    x: 0.5,
    y: '55%',
    w: '90%',
    h: 0.5,
    align: 'center',
    fontSize: 28,
    color: 'FFFFFF',
    fontFace: 'Arial',
  });
  
  pptx.writeFile({ fileName: `${courseData.topic}-course-slides.pptx` });
}