import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingScreen.css';

const charismaTips = [
  {
    text: "Charisma isn't loud — it's presence.",
    description: "People feel drawn to those who are fully present. Make eye contact, slow your breath, and focus deeply on the person in front of you. That alone radiates confidence.",
    icon: "👁️"
  },
  {
    text: "Speak like you're already understood.",
    description: "Charismatic people don't over-explain or qualify. They speak clearly, as if what they say carries weight — because it does.",
    icon: "💬"
  },
  {
    text: "Master the power of the pause.",
    description: "Don't rush to fill silence. A well-placed pause adds gravity, builds tension, and shows control. It invites others to lean in.",
    icon: "⏸️"
  },
  {
    text: "Make people feel seen, not impressed.",
    description: "Shift from 'How can I be interesting?' to 'How can I make them feel interesting?' Validation is magnetic.",
    icon: "✨"
  },
  {
    text: "Confidence without warmth is arrogance.",
    description: "The most charismatic people blend both — self-assured yet kind, bold yet inclusive.",
    icon: "🔥"
  },
  {
    text: "Mirror emotions, not mannerisms.",
    description: "Instead of copying gestures (which can feel creepy), match emotional tone. If someone's excited, get excited. If they're contemplative, get curious.",
    icon: "🪞"
  },
  {
    text: "Tell stories, not facts.",
    description: "Stories activate emotions and create connection. Even if you're just recounting your day, frame it with tension, humor, or surprise.",
    icon: "📚"
  },
  {
    text: "Use names deliberately.",
    description: "Using someone's name — especially during praise or a question — deepens rapport and makes them feel uniquely valued.",
    icon: "🎯"
  },
  {
    text: "Be the punctuation in the conversation.",
    description: "Add energy, humor, or insight at just the right moment. Charisma often lies in timing, not dominance.",
    icon: "⚡"
  },
  {
    text: "Tease with warmth, not edge.",
    description: "Teasing builds connection when it's light and inclusive. Make them laugh with you, not feel laughed at.",
    icon: "😏"
  },
  {
    text: "Be curious about their inner world.",
    description: "Ask questions like 'What did that mean to you?' or 'How did that make you feel?' to instantly stand out from surface-level flirts.",
    icon: "🧠"
  },
  {
    text: "Stand like you own the moment.",
    description: "Shoulders back, chin slightly up, grounded stance. Your body often speaks before your words do.",
    icon: "🏛️"
  },
  {
    text: "Don't chase approval — invite it.",
    description: "Needy energy repels. When you're okay with not being liked, you paradoxically become more likable.",
    icon: "🧲"
  },
  {
    text: "Use 'you' more than 'I'.",
    description: "In flirting or conversation, prioritize the other person's perspective. 'You must get that a lot' is more engaging than 'I think you're cool.'",
    icon: "💭"
  },
  {
    text: "Charm is in contrast.",
    description: "Be unpredictable in a good way. Kind but cheeky. Confident but self-deprecating. People remember what defies expectations.",
    icon: "🎭"
  },
  {
    text: "Be specific with compliments.",
    description: "'You have a cool vibe' is forgettable. 'You have the kind of smile that makes people lower their guard' — unforgettable.",
    icon: "🎨"
  },
  {
    text: "Drop the script, tune into the moment.",
    description: "Don't rehearse your next line — react to what's alive in the conversation. Spontaneity is electric.",
    icon: "🎵"
  },
  {
    text: "Don't overinvest too early.",
    description: "Keep emotional pacing aligned. Giving too much too soon can feel overwhelming or unbalanced.",
    icon: "⚖️"
  },
  {
    text: "Ask meaningful follow-ups.",
    description: "If they say they love art, ask 'What's a piece that changed how you see the world?' Real interest feels rare — and irresistible.",
    icon: "🔍"
  },
  {
    text: "Be someone who brings energy, not extracts it.",
    description: "People remember how they feel around you. Aim to be the person who lifts the vibe wherever you go.",
    icon: "🌟"
  }
];

export const LoadingScreen = () => {
  const navigate = useNavigate();
  const [currentTip, setCurrentTip] = useState(Math.floor(Math.random() * charismaTips.length));
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [, setUsedTips] = useState(new Set<number>());
  const [backgroundVariant, setBackgroundVariant] = useState(0);

  useEffect(() => {
    // Simple 30 second timer
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 10000); // 30 seconds total

    // Change tips every 6 seconds with random selection
    const tipInterval = setInterval(() => {
      setUsedTips(prev => {
        let newTip;
        do {
          newTip = Math.floor(Math.random() * charismaTips.length);
        } while (prev.has(newTip) && prev.size < charismaTips.length);
        
        const newUsedTips = new Set(prev);
        newUsedTips.add(newTip);
        
        // Reset used tips if we've used all of them
        if (newUsedTips.size >= charismaTips.length) {
          newUsedTips.clear();
          newUsedTips.add(newTip);
        }
        
        setCurrentTip(newTip);
        setBackgroundVariant(Math.floor(Math.random() * 5)); // 5 different background variants
        return newUsedTips;
      });
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearInterval(tipInterval);
    };
  }, [navigate]);

  // Typewriter effect for current tip
  useEffect(() => {
    const currentTipText = charismaTips[currentTip].text;
    setDisplayedText('');
    setIsTyping(true);
    
    let i = 0;
    const typeWriter = setInterval(() => {
      if (i < currentTipText.length) {
        setDisplayedText(currentTipText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeWriter);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(typeWriter);
  }, [currentTip]);

  return (
    <div className={`cinematic-loading-screen bg-variant-${backgroundVariant}`}>
      {/* Animated Background with Bokeh Effects */}
      <div className="purple-blue-background">
        {/* Bokeh lights */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="bokeh-light" 
            style={{
              '--delay': `${Math.random() * 5}s`,
              '--size': `${Math.random() * 80 + 30}px`,
              '--left': `${Math.random() * 100}%`,
              '--top': `${Math.random() * 100}%`,
              '--duration': `${Math.random() * 6 + 8}s`,
              '--hue': Math.random() * 60 + 240, // Purple/blue range
            } as React.CSSProperties} 
          />
        ))}
        
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div 
            key={`particle-${i}`} 
            className="floating-particle" 
            style={{
              '--delay': `${Math.random() * 8}s`,
              '--left': `${Math.random() * 100}%`,
              '--duration': `${Math.random() * 25 + 20}s`,
            } as React.CSSProperties} 
          />
        ))}
      </div>
      
      {/* HuzzAI Logo Window */}
      <div className="huzz-window-container">
        <div className="huzz-window">
          <img 
            src="/huzzlogo.png" 
            alt="HuzzAI Logo" 
            className="huzz-logo-image"
          />
          <h1 className="huzz-title-text">HuzzAI</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="cinematic-content">
        
        {/* Charisma Tips Section */}
        <div className="charisma-tips-section">
          <div className="tips-header">
            <span className="tips-title">💡 Liquid Gold Charisma</span>
          </div>
          
          <div className="tip-display">
            <div className="tip-icon-display">
              {charismaTips[currentTip].icon}
            </div>
            <div className="tip-content">
              <h3 className="tip-headline">
                {displayedText}
                {isTyping && <span className="typing-cursor">|</span>}
              </h3>
              <p className="tip-description">
                {charismaTips[currentTip].description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Loading Status */}
        <div className="loading-status">
          <div className="status-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="status-text">Crafting your charismatic persona</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
