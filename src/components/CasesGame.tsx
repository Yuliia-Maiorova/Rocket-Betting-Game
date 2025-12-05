import { useState, useRef } from 'react';

interface CaseItem {
  emoji: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'gold';
}

interface CaseType {
  id: string;
  name: string;
  icon: string;
  price: number;
  items: CaseItem[];
}

const CASES: CaseType[] = [
  {
    id: 'animal',
    name: 'Animal Case',
    icon: '🐻',
    price: 50,
    items: [
      { emoji: '🐶', name: 'Dog', rarity: 'common' },
      { emoji: '🐱', name: 'Cat', rarity: 'common' },
      { emoji: '🐸', name: 'Frog', rarity: 'common' },
      { emoji: '🐹', name: 'Hamster', rarity: 'common' },
      { emoji: '🐰', name: 'Rabbit', rarity: 'uncommon' },
      { emoji: '🦊', name: 'Fox', rarity: 'uncommon' },
      { emoji: '🐼', name: 'Panda', rarity: 'rare' },
      { emoji: '🦁', name: 'Lion', rarity: 'rare' },
      { emoji: '🐯', name: 'Tiger', rarity: 'epic' },
      { emoji: '🦄', name: 'Unicorn', rarity: 'legendary' },
      { emoji: '🐉', name: 'Dragon', rarity: 'gold' },
    ],
  },
  {
    id: 'space',
    name: 'Space Case',
    icon: '🚀',
    price: 75,
    items: [
      { emoji: '⭐', name: 'Star', rarity: 'common' },
      { emoji: '🌙', name: 'Moon', rarity: 'common' },
      { emoji: '☄️', name: 'Comet', rarity: 'common' },
      { emoji: '🌍', name: 'Earth', rarity: 'uncommon' },
      { emoji: '🪐', name: 'Saturn', rarity: 'uncommon' },
      { emoji: '🌌', name: 'Galaxy', rarity: 'rare' },
      { emoji: '🚀', name: 'Rocket', rarity: 'rare' },
      { emoji: '👽', name: 'Alien', rarity: 'epic' },
      { emoji: '🛸', name: 'UFO', rarity: 'epic' },
      { emoji: '🔭', name: 'Telescope', rarity: 'legendary' },
      { emoji: '🌞', name: 'Sun', rarity: 'gold' },
    ],
  },
  {
    id: 'food',
    name: 'Food Case',
    icon: '🍕',
    price: 40,
    items: [
      { emoji: '🍎', name: 'Apple', rarity: 'common' },
      { emoji: '🍌', name: 'Banana', rarity: 'common' },
      { emoji: '🍞', name: 'Bread', rarity: 'common' },
      { emoji: '🥕', name: 'Carrot', rarity: 'common' },
      { emoji: '🍕', name: 'Pizza', rarity: 'uncommon' },
      { emoji: '🍔', name: 'Burger', rarity: 'uncommon' },
      { emoji: '🌮', name: 'Taco', rarity: 'rare' },
      { emoji: '🍰', name: 'Cake', rarity: 'rare' },
      { emoji: '🍣', name: 'Sushi', rarity: 'epic' },
      { emoji: '🦞', name: 'Lobster', rarity: 'legendary' },
      { emoji: '💎', name: 'Diamond Food', rarity: 'gold' },
    ],
  },
  {
    id: 'sports',
    name: 'Sports Case',
    icon: '⚽',
    price: 60,
    items: [
      { emoji: '⚽', name: 'Soccer', rarity: 'common' },
      { emoji: '🏀', name: 'Basketball', rarity: 'common' },
      { emoji: '🏈', name: 'Football', rarity: 'common' },
      { emoji: '⚾', name: 'Baseball', rarity: 'common' },
      { emoji: '🎾', name: 'Tennis', rarity: 'uncommon' },
      { emoji: '🏐', name: 'Volleyball', rarity: 'uncommon' },
      { emoji: '🏓', name: 'Ping Pong', rarity: 'rare' },
      { emoji: '🥊', name: 'Boxing', rarity: 'rare' },
      { emoji: '🥇', name: 'Gold Medal', rarity: 'epic' },
      { emoji: '🏆', name: 'Trophy', rarity: 'legendary' },
      { emoji: '👑', name: 'Crown', rarity: 'gold' },
    ],
  },
];

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#ef4444',
  gold: '#f59e0b',
};

const RARITY_CHANCES: Record<string, number> = {
  common: 55,
  uncommon: 25,
  rare: 12,
  epic: 5,
  legendary: 2.5,
  gold: 0.5,
};

interface CasesGameProps {
  balance: number;
  setBalance: (balance: number | ((prev: number) => number)) => void;
}

export default function CasesGame({ balance, setBalance }: CasesGameProps) {
  const [selectedCase, setSelectedCase] = useState<CaseType>(CASES[0]);
  const [isOpening, setIsOpening] = useState(false);
  const [spinItems, setSpinItems] = useState<CaseItem[]>([]);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const getRandomItem = (caseType: CaseType): CaseItem => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const rarity of ['common', 'uncommon', 'rare', 'epic', 'legendary', 'gold'] as const) {
      cumulative += RARITY_CHANCES[rarity];
      if (random <= cumulative) {
        const itemsOfRarity = caseType.items.filter(item => item.rarity === rarity);
        if (itemsOfRarity.length > 0) {
          return itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
        }
      }
    }
    
    return caseType.items[0];
  };

  const generateSpinItems = (caseType: CaseType, winItem: CaseItem): CaseItem[] => {
    const items: CaseItem[] = [];
    const totalItems = 60;
    const winPosition = 52;

    for (let i = 0; i < totalItems; i++) {
      if (i === winPosition) {
        items.push(winItem);
      } else {
        const randomIndex = Math.floor(Math.random() * caseType.items.length);
        items.push(caseType.items[randomIndex]);
      }
    }

    return items;
  };

  const calculatePayout = (item: CaseItem, casePrice: number): number => {
    const multipliers: Record<string, number> = {
      common: 0.5,
      uncommon: 1.2,
      rare: 2.5,
      epic: 5,
      legendary: 15,
      gold: 50,
    };
    return Math.floor(casePrice * multipliers[item.rarity]);
  };

  const openCase = async () => {
    if (isOpening || balance < selectedCase.price) return;

    setBalance((prev: number) => prev - selectedCase.price);
    setIsOpening(true);
    setWonItem(null);
    setShowResult(false);

    const winItem = getRandomItem(selectedCase);
    const items = generateSpinItems(selectedCase, winItem);
    setSpinItems(items);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (spinnerRef.current) {
      const itemWidth = 100;
      const gap = 8;
      const totalItemWidth = itemWidth + gap;
      const winPosition = 52;

      // (winPosition * totalItemWidth) + (itemWidth / 2) to get to center of winning item
      const offset = (winPosition * totalItemWidth) + (itemWidth / 2);
      
      spinnerRef.current.style.transition = 'none';
      spinnerRef.current.style.transform = 'translateX(0)';
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      spinnerRef.current.style.transition = 'transform 5s cubic-bezier(0.15, 0.85, 0.35, 1)';
      spinnerRef.current.style.transform = `translateX(-${offset}px)`;
    }

    setTimeout(() => {
      setWonItem(winItem);
      setShowResult(true);
      setIsOpening(false);
      
      const payout = calculatePayout(winItem, selectedCase.price);
      setBalance((prev: number) => prev + payout);
    }, 5200);
  };

  const styles = {
    container: {
      background: 'rgba(30, 41, 59, 0.95)',
      borderRadius: '1rem',
      padding: '1.5rem',
      minHeight: '500px',
    },
    title: {
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    casesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    },
    caseCard: (isSelected: boolean) => ({
      background: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(51, 65, 85, 0.5)',
      border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
      borderRadius: '0.75rem',
      padding: '1rem 0.5rem',
      cursor: 'pointer',
      textAlign: 'center' as const,
      transition: 'all 0.2s ease',
    }),
    caseIcon: {
      fontSize: '2.5rem',
      display: 'block',
      marginBottom: '0.5rem',
    },
    caseName: {
      color: '#fff',
      fontSize: '0.75rem',
      fontWeight: 500,
      marginBottom: '0.25rem',
    },
    casePrice: {
      color: '#22c55e',
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    spinnerContainer: {
      background: 'rgba(51, 65, 85, 0.5)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    spinnerViewport: {
      position: 'relative' as const,
      height: '100px',
      overflow: 'hidden',
    },
    spinner: {
      display: 'flex',
      gap: '8px',
      position: 'absolute' as const,
      left: '50%',
    },
    spinItem: (rarity: string) => ({
      width: '100px',
      height: '100px',
      background: `linear-gradient(135deg, ${RARITY_COLORS[rarity]}40, ${RARITY_COLORS[rarity]}20)`,
      border: `2px solid ${RARITY_COLORS[rarity]}`,
      borderRadius: '0.5rem',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }),
    spinItemEmoji: {
      fontSize: '2.5rem',
    },
    spinItemName: {
      fontSize: '0.625rem',
      color: '#fff',
      marginTop: '0.25rem',
    },
    indicator: {
      position: 'absolute' as const,
      left: '50%',
      top: 0,
      bottom: 0,
      width: '4px',
      background: '#fbbf24',
      transform: 'translateX(-50%)',
      zIndex: 10,
      boxShadow: '0 0 10px #fbbf24',
    },
    openButton: {
      width: '100%',
      padding: '1rem',
      background: balance >= selectedCase.price ? '#22c55e' : '#475569',
      color: '#fff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: balance >= selectedCase.price && !isOpening ? 'pointer' : 'not-allowed',
      opacity: balance >= selectedCase.price && !isOpening ? 1 : 0.7,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem',
    },
    contentsTitle: {
      color: '#fff',
      fontSize: '0.875rem',
      fontWeight: 600,
      marginBottom: '0.75rem',
    },
    contentsGrid: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    contentItem: (rarity: string) => ({
      width: '40px',
      height: '40px',
      background: `linear-gradient(135deg, ${RARITY_COLORS[rarity]}60, ${RARITY_COLORS[rarity]}30)`,
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
    }),
    rarityGuide: {
      background: 'rgba(51, 65, 85, 0.5)',
      borderRadius: '0.5rem',
      padding: '0.75rem',
    },
    rarityTitle: {
      color: '#fff',
      fontSize: '0.75rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    rarityGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.5rem',
    },
    rarityItem: () => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontSize: '0.625rem',
      color: '#94a3b8',
    }),
    rarityDot: (color: string) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: color,
    }),
    resultOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    resultCard: (rarity: string) => ({
      background: `linear-gradient(135deg, ${RARITY_COLORS[rarity]}30, rgba(30, 41, 59, 0.95))`,
      border: `3px solid ${RARITY_COLORS[rarity]}`,
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center' as const,
      animation: 'popIn 0.3s ease',
    }),
    resultEmoji: {
      fontSize: '5rem',
      display: 'block',
      marginBottom: '1rem',
    },
    resultName: {
      color: '#fff',
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    resultRarity: (color: string) => ({
      color: color,
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
      marginBottom: '1rem',
    }),
    resultPayout: {
      color: '#22c55e',
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '1.5rem',
    },
    closeButton: {
      padding: '0.75rem 2rem',
      background: '#3b82f6',
      color: '#fff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
    },
    placeholder: {
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
      fontSize: '0.875rem',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Select a Case</h3>
      
      <div style={styles.casesGrid}>
        {CASES.map((caseType) => (
          <div
            key={caseType.id}
            style={styles.caseCard(selectedCase.id === caseType.id)}
            onClick={() => !isOpening && setSelectedCase(caseType)}
          >
            <span style={styles.caseIcon}>{caseType.icon}</span>
            <div style={styles.caseName}>{caseType.name}</div>
            <div style={styles.casePrice}>${caseType.price}</div>
          </div>
        ))}
      </div>

      <div style={styles.spinnerContainer}>
        <div style={styles.indicator} />
        <div style={styles.spinnerViewport}>
          {spinItems.length > 0 ? (
            <div ref={spinnerRef} style={styles.spinner}>
              {spinItems.map((item, index) => (
                <div key={index} style={styles.spinItem(item.rarity)}>
                  <span style={styles.spinItemEmoji}>{item.emoji}</span>
                  <span style={styles.spinItemName}>{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.placeholder}>
              Select a case and click Open to start
            </div>
          )}
        </div>
      </div>

      <button
        style={styles.openButton}
        onClick={openCase}
        disabled={isOpening || balance < selectedCase.price}
      >
        {isOpening ? (
          <>⏳ Opening...</>
        ) : (
          <>🎰 Open {selectedCase.name} - ${selectedCase.price}</>
        )}
      </button>

      <h4 style={styles.contentsTitle}>Case Contents</h4>
      <div style={styles.contentsGrid}>
        {selectedCase.items.map((item, index) => (
          <div key={index} style={styles.contentItem(item.rarity)} title={`${item.name} (${item.rarity})`}>
            {item.emoji}
          </div>
        ))}
      </div>

      <div style={styles.rarityGuide}>
        <div style={styles.rarityTitle}>Rarity Guide</div>
        <div style={styles.rarityGrid}>
          {Object.entries(RARITY_CHANCES).map(([rarity, chance]) => (
            <div key={rarity} style={styles.rarityItem()}>
              <span style={styles.rarityDot(RARITY_COLORS[rarity])} />
              <span>{rarity.charAt(0).toUpperCase() + rarity.slice(1)} ({chance}%)</span>
            </div>
          ))}
        </div>
      </div>

      {showResult && wonItem && (
        <div style={styles.resultOverlay} onClick={() => setShowResult(false)}>
          <div style={styles.resultCard(wonItem.rarity)} onClick={(e) => e.stopPropagation()}>
            <span style={styles.resultEmoji}>{wonItem.emoji}</span>
            <div style={styles.resultName}>{wonItem.name}</div>
            <div style={styles.resultRarity(RARITY_COLORS[wonItem.rarity])}>{wonItem.rarity}</div>
            <div style={styles.resultPayout}>
              +${calculatePayout(wonItem, selectedCase.price)}
            </div>
            <button style={styles.closeButton} onClick={() => setShowResult(false)}>
              Continue
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
