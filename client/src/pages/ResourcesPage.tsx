import { useState } from 'react';
import HomeLayout from '@/components/layouts/HomeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResourcesPage() {
  const [activeSection, setActiveSection] = useState('writing');

  const sections = {
    writing: {
      title: "Writing Guides",
      cards: [
        {
          title: "Getting Started",
          description: "Basic writing principles and finding your writing style",
          items: [
            {
              main: "Basic writing principles",
              sub: [
                "Use sensory details to immerse readers",
                "Make sentences more dynamic",
                "Avoid vagie language; paint vivid images",
                "Maintain consistent tense",
                "Use proper grammar and punctuation"
              ]
            },
            {
              main: "Finding your writing style",
              sub: [
                "Experiment with different voices",
                "Read widely in your genre",
                "Practice different writing techniques",
                "Identify patterns and tones that feel like you",
                "Stay true to your natural style"
              ]
            },
            {
              main: "Overcoming writer's block",
              sub: [
                "Take regular breaks",
                "Change your writing environment",
                "Try free writing exercises",
                "Set small, achievable goals",
                "Read for inspiration"
              ]
            },
            {
              main: "Setting up a writing routine",
              sub: [
                "Choose a consistent time",
                "Create a dedicated space to focus",
                "Set daily word count goals",
                "Build writing habits gradually"
              ]
            }
          ]
        },
        {
          title: "Character Development",
          description: "Create memorable characters and develop their arcs",
          items: [
            {
              main: "Creating memorable characters",
              sub: [
                "Give characters distinct personalities and quirks",
                "Create detailed backstories that shape their behavior",
                "Develop unique speech patterns and mannerisms",
                "Add meaningful flaws and internal conflicts",
                "Establish clear goals and motivations"
              ]
            },
            {
              main: "Character arcs",
              sub: [
                "Plan meaningful growth and transformation",
                "Create challenges that test their beliefs",
                "Show internal struggles and decision-making",
                "Include pivotal moments of change",
              ]
            },
            {
              main: "Dialogue writing",
              sub: [
                "Make conversations feel natural and flowing",
                "Use dialogue to reveal character traits",
                "Vary speech patterns between characters",
                "Include meaningful subtext and implications",
                "Balance dialogue with action and description"
              ]
            },
            {
              main: "Character relationships",
              sub: [
                "Create dynamic interactions between characters",
                "Develop relationships and conflicts",
                "Show how relationships evolve over time",
                "Include both supportive and antagonistic relationships",
                "Use relationships to drive the plot forward"
              ]
            }
          ]
        },
        {
          title: "Plot Structure",
          description: "Master the art of story structure and plot development",
          items: [
            {
              main: "Story structure basics",
              sub: [
                "Follow the three-act structure (setup, confrontation, resolution)",
                "Build rising action with increasing tension",
                "Develop a climax and resolution",
                "Maintain clear cause-and-effect relationships"
              ]
            },
            {
              main: "Plot development",
              sub: [
                "Outline major plot points and turning points",
                "Create subplots that stay supportive",
                "Plant and pay off story elements",
                "Balance action with character development",
                "Keep the story moving forward purposefully"
              ]
            },
            {
              main: "Conflict creation",
              sub: [
                "Mix internal and external conflicts",
                "Create obstacles that challenge characters",
                "Develop meaningful stakes and consequences",
                "Build tension through escalating conflicts",
              ]
            },
            {
              main: "Pacing techniques",
              sub: [
                "Maintain consistent tenses",
                "Allow breathing room after intense moments",
                "Build momentum toward key scenes",
                "Balance fast and slow-paced sections"
              ]
            }
          ]
        }
      ]
    },
    reading: {
      title: "Reading Tips",
      cards: [
        {
          title: "Speed Reading",
          description: "Improve your reading speed while maintaining comprehension",
          items: [
            {
              main: "Basic techniques",
              sub: [
                "Minimize subvocalization",
                "Expand your vision span to read more words",
                "Practice chunk reading",
                "Maintain focus and reduce distractions"
              ]
            },
            {
              main: "Comprehension strategies",
              sub: [
                "Preview material before reading in detail",
                "Identify and focus on key points",
                "Review main ideas after each section"
              ]
            },
            {
              main: "Practice exercises",
              sub: [
                "Set timed reading sessions",
                "Try progressive speed drills",
                "Do regular comprehension checks"
              ]
            }
          ]
        },
        {
          title: "Reading Comprehension",
          description: "Enhance your understanding of what you read",
          items: [
            {
              main: "Active reading strategies",
              sub: [
                "Ask questions while reading",
                "Visualize scenes and concepts",
                "Summarize key points in your own words"
              ]
            },
            {
              main: "Note-taking methods",
              sub: [
                "Cornell note-taking system",
                "Create mind maps for complex topics",
                "Highlight key passages effectively",
                "Write margin notes and questions",
                "Organize notes by themes and topics"
              ]
            },
            {
              main: "Understanding themes",
              sub: [
                "Identify recurring motifs and symbols",
                "Analyze character development",
                "Examine plot structure and patterns",
                "Consider historical and cultural context",
              ]
            },
            {
              main: "Literary analysis",
              sub: [
                "Examine writing style and techniques",
                "Analyze narrative perspective",
                "Study character relationships",
                "Evaluate plot structure",
              ]
            }
          ]
        }
      ]
    },
    literary: {
      title: "Literary Resources",
      cards: [
        {
          title: "Writing Tools",
          description: "Essential tools and software for writers",
          items: [
            {
              main: "Online writing platforms",
              sub: [
                "Medium for articles and essays",
                "WordPress for blogging",
                "Substack for newsletters",
                "Royal Road for web novels"
              ]
            },
            {
              main: "Grammar checkers",
              sub: [
                "Grammarly for comprehensive checking",
                "ProWritingAid for style analysis",
                "Hemingway Editor for readability",
                "LanguageTool for multilingual support",
                "Ginger for real-time correction"
              ]
            },
            {
              main: "Research tools",
              sub: [
                "Google Scholar for academic sources",
                "Wikipedia for quick references",
                "Library databases",
                "Citation tools",
              ]
            }
          ]
        },
        {
          title: "Reference Materials",
          description: "Essential resources for writers and readers",
          items: [
            {
              main: "Writing styles",
              sub: [
                "Explore different narrative voices",
                "Study various writing genres",
                "Understand tone and mood",
                "Practice different perspectives"
              ]
            },
            {
              main: "Genre conventions",
              sub: [
                "Study genre-specifics",
                "Learn reader expectations",
                "Understand genre boundaries",
                "Explore subgenre variations"
              ]
            },
            {
              main: "Formatting guides",
              sub: [
                "Learn manuscript formatting",
                "Study publishing guidelines",
                "Understand citation styles",
                "Follow submission requirements"
              ]
            }
          ]
        }
      ]
    },
    community: {
      title: "Community Guides",
      cards: [
        {
          title: "How to Write Reviews",
          description: "Learn to write effective and engaging book reviews",
          items: [
            {
              main: "Review structure",
              sub: [
                "Start with an engaging hook",
                "Include basic book information",
                "Summarize without major spoilers",
                "Analyze key elements and themes",
                "End with a clear recommendation"
              ]
            },
            {
              main: "Writing tips",
              sub: [
                "Be honest but respectful",
                "Support opinions with examples",
                "Consider the target audience",
                "Use clear, engaging language"
              ]
            },
            {
              main: "Common pitfalls",
              sub: [
                "Avoid revealing major spoilers",
                "Don't be overly negative",
                "Stay focused on the book",
                "Don't make it personal",
                "Avoid generic statements"
              ]
            }
          ]
        },
        {
          title: "Participating in Discussions",
          description: "Engage meaningfully with the community",
          items: [
            {
              main: "Discussion etiquette",
              sub: [
                "Be respectful of others' opinions",
                "Stay on topic and relevant",
                "Use clear, constructive language",
                "Acknowledge different perspectives",
                "Follow community guidelines"
              ]
            },
            {
              main: "Engaging with others",
              sub: [
                "Ask thoughtful questions",
                "Share personal insights",
                "Respond to others' comments",
                "Build on existing discussions",
                "Create meaningful connections"
              ]
            },
            {
              main: "Community guidelines",
              sub: [
                "Follow posting rules",
                "Respect content warnings",
                "Help maintain positive atmosphere",
                "Contribute to community growth"
              ]
            }
          ]
        }
      ]
    }
  };

  return (
    <HomeLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background to-accent/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Community Resources</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our collection of guides, tips, and resources to enhance your writing and reading experience.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mb-8">
              {Object.keys(sections).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeSection === section
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {sections[section as keyof typeof sections].title}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border ring-1 ring-ring/10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections[activeSection as keyof typeof sections].cards.map((card, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {card.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {typeof item === 'string' ? item : item.main}
                            </div>
                            {typeof item !== 'string' && item.sub && (
                              <ul className="ml-6 space-y-1">
                                {item.sub.map((subItem, subIndex) => (
                                  <li key={subIndex} className="text-sm text-muted-foreground">
                                    • {subItem}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
} 