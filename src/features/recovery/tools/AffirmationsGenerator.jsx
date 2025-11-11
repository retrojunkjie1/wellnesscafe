import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Sparkles, RefreshCw, Share2, Heart, Lock } from "lucide-react";
import "./AffirmationsGenerator.css";

const CATEGORIES = {
  recovery: {
    name: "Recovery",
    icon: "💪",
    color: "#4db8a8",
    affirmations: [
      "I am stronger than my cravings.",
      "Each day in recovery is a victory I celebrate.",
      "I choose healing over temporary relief.",
      "My past does not define my future.",
      "I am worthy of a healthy, fulfilling life.",
      "Recovery is my daily commitment to myself.",
      "I have the power to change my story.",
      "Every step forward is progress, no matter how small.",
      "I am resilient and capable of transformation.",
      "My sobriety is a gift I give myself every day.",
      "I replace old habits with healing practices.",
      "I am building the life I deserve.",
      "Recovery teaches me strength I never knew I had.",
      "I am proud of how far I've come.",
      "I trust the process of my healing journey.",
      "I am learning to love myself more each day.",
      "My commitment to recovery grows stronger daily.",
      "I choose connection over isolation.",
      "I am worthy of support and compassion.",
      "Recovery is teaching me who I truly am.",
    ],
  },
  confidence: {
    name: "Confidence",
    icon: "🌟",
    color: "#d4b483",
    affirmations: [
      "I am capable and competent.",
      "I trust my decisions and my path.",
      "My voice matters and deserves to be heard.",
      "I am enough, exactly as I am.",
      "I embrace challenges as opportunities to grow.",
      "I believe in my ability to succeed.",
      "I radiate confidence and self-assurance.",
      "I am worthy of respect and admiration.",
      "I trust myself to handle whatever comes.",
      "I am becoming the best version of myself.",
      "My potential is limitless.",
      "I stand tall in my truth.",
      "I celebrate my unique gifts and talents.",
      "I am confident in my journey.",
      "I trust my intuition and inner wisdom.",
      "I am proud of my progress.",
      "I face each day with courage and conviction.",
      "I am deserving of all good things.",
      "I own my story with pride.",
      "I am powerful beyond measure.",
    ],
  },
  peace: {
    name: "Peace",
    icon: "🕊️",
    color: "#8a63d2",
    affirmations: [
      "I am at peace with my past.",
      "I release what I cannot control.",
      "Calm flows through me like a gentle river.",
      "I choose peace over worry.",
      "I am safe in this present moment.",
      "Peace is my natural state of being.",
      "I let go of tension with each breath.",
      "I am surrounded by tranquility.",
      "I trust life's natural flow.",
      "Inner peace is my priority.",
      "I release anxiety and embrace calm.",
      "I am grounded and centered.",
      "Serenity fills my mind and body.",
      "I accept what is and let go of what was.",
      "I find peace in stillness.",
      "My mind is clear and calm.",
      "I am free from the chaos around me.",
      "Peace begins within me.",
      "I breathe in calm, I breathe out stress.",
      "I am a peaceful presence in the world.",
    ],
  },
  gratitude: {
    name: "Gratitude",
    icon: "🙏",
    color: "#f4a261",
    affirmations: [
      "I am grateful for this new day.",
      "Abundance surrounds me in countless forms.",
      "I appreciate the small joys in life.",
      "Gratitude fills my heart and guides my actions.",
      "I am thankful for my journey, including the challenges.",
      "Every breath is a gift I cherish.",
      "I see blessings in unexpected places.",
      "I am grateful for the people who support me.",
      "My life is full of reasons to be thankful.",
      "I appreciate my body and all it does for me.",
      "Gratitude transforms my perspective.",
      "I am blessed beyond measure.",
      "I give thanks for both trials and triumphs.",
      "I recognize the abundance in my life.",
      "Gratitude opens doors to more blessings.",
      "I am thankful for my growth and learning.",
      "I appreciate the present moment.",
      "Gratitude is my daily practice.",
      "I am grateful for second chances.",
      "My heart overflows with appreciation.",
    ],
  },
  strength: {
    name: "Strength",
    icon: "⚡",
    color: "#e63946",
    affirmations: [
      "I am resilient and capable of overcoming any obstacle.",
      "My strength grows with every challenge I face.",
      "I have survived 100% of my hardest days.",
      "I am stronger than I realize.",
      "Courage flows through my veins.",
      "I rise above adversity with grace.",
      "My spirit is unbreakable.",
      "I am a warrior, not a worrier.",
      "I transform pain into power.",
      "I am built to withstand life's storms.",
      "My inner strength guides me forward.",
      "I face fear with bravery.",
      "I am tougher than my toughest day.",
      "Resilience is my superpower.",
      "I draw strength from within.",
      "I am unstoppable when I believe in myself.",
      "My determination is stronger than any setback.",
      "I embrace my power to persevere.",
      "I am fortified by my experiences.",
      "Strength is my birthright.",
    ],
  },
};

const AffirmationsGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState("recovery");
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    generateRandomAffirmation(selectedCategory);
    // Load favorites from localStorage
    const saved = localStorage.getItem("affirmationFavorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const generateRandomAffirmation = (category) => {
    setIsAnimating(true);
    const affirmations = CATEGORIES[category].affirmations;
    const randomIndex = Math.floor(Math.random() * affirmations.length);

    setTimeout(() => {
      setCurrentAffirmation(affirmations[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    generateRandomAffirmation(category);
  };

  const handleRefresh = () => {
    generateRandomAffirmation(selectedCategory);
  };

  const handleFavorite = () => {
    if (favorites.length >= 5) {
      setShowUpgradePrompt(true);
      return;
    }

    if (!favorites.includes(currentAffirmation)) {
      const newFavorites = [...favorites, currentAffirmation];
      setFavorites(newFavorites);
      localStorage.setItem(
        "affirmationFavorites",
        JSON.stringify(newFavorites)
      );
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Daily Affirmation",
      text: `"${currentAffirmation}" - from WellnessCafe`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`"${currentAffirmation}" - WellnessCafe`);
      alert("Affirmation copied to clipboard!");
    }
  };

  const categoryColor = CATEGORIES[selectedCategory].color;

  return (
    <div className="affirmations-generator">
      <Helmet>
        <title>Affirmations Generator - WellnessCafe</title>
        <meta
          name="description"
          content="Generate inspiring affirmations for recovery, confidence, peace, gratitude, and strength."
        />
      </Helmet>

      <div className="affirmations-header">
        <Sparkles className="header-icon" />
        <h1>Daily Affirmations</h1>
        <p>
          Choose a category and discover powerful affirmations to guide your day
        </p>
      </div>

      <div className="categories-selector">
        {Object.entries(CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            className={`category-btn ${
              selectedCategory === key ? "active" : ""
            }`}
            onClick={() => handleCategoryChange(key)}
            style={{
              "--category-color": category.color,
              background:
                selectedCategory === key
                  ? `linear-gradient(135deg, ${category.color}, ${category.color}dd)`
                  : "rgba(255,255,255,0.05)",
            }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div
        className={`affirmation-card ${isAnimating ? "animating" : ""}`}
        style={{
          borderColor: categoryColor,
          background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${categoryColor}15)`,
        }}
      >
        <div className="affirmation-content">
          <div className="quote-mark">"</div>
          <p className="affirmation-text">{currentAffirmation}</p>
          <div className="quote-mark closing">"</div>
        </div>

        <div className="affirmation-actions">
          <button
            className="action-btn refresh-btn"
            onClick={handleRefresh}
            aria-label="Generate new affirmation"
          >
            <RefreshCw />
            <span>New</span>
          </button>
          <button
            className="action-btn favorite-btn"
            onClick={handleFavorite}
            aria-label="Add to favorites"
          >
            <Heart
              fill={
                favorites.includes(currentAffirmation) ? categoryColor : "none"
              }
            />
            <span>Save</span>
          </button>
          <button
            className="action-btn share-btn"
            onClick={handleShare}
            aria-label="Share affirmation"
          >
            <Share2 />
            <span>Share</span>
          </button>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h3>Your Favorites ({favorites.length}/5 Free)</h3>
          <div className="favorites-grid">
            {favorites.map((fav, idx) => (
              <div key={idx} className="favorite-item">
                <p>"{fav}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="affirmations-info">
        <div className="info-card">
          <h3>💎 Upgrade for Premium Features</h3>
          <ul>
            <li>
              <Lock size={16} /> Unlimited favorites
            </li>
            <li>
              <Lock size={16} /> Custom affirmations library
            </li>
            <li>
              <Lock size={16} /> Daily affirmation reminders
            </li>
            <li>
              <Lock size={16} /> Track your affirmation journey
            </li>
          </ul>
          <button className="upgrade-btn">Upgrade to Premium</button>
        </div>

        <div className="tips-card">
          <h3>How to Use Affirmations</h3>
          <ol>
            <li>Choose a category that resonates with you</li>
            <li>Read the affirmation slowly and mindfully</li>
            <li>Repeat it 3-5 times, believing each word</li>
            <li>Visualize yourself embodying this truth</li>
            <li>Return to it throughout your day</li>
          </ol>
        </div>
      </div>

      {showUpgradePrompt && (
        <div
          className="modal-overlay"
          onClick={() => setShowUpgradePrompt(false)}
        >
          <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Unlock Unlimited Favorites</h2>
            <p>
              Free users can save up to 5 affirmations. Upgrade to Premium for
              unlimited favorites and more features!
            </p>
            <div className="modal-actions">
              <button className="btn-primary">Upgrade Now - $9.99/mo</button>
              <button
                className="btn-secondary"
                onClick={() => setShowUpgradePrompt(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffirmationsGenerator;
