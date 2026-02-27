/**
 * Crisis Detection Service
 * Analyzes conversation content for crisis indicators
 */

const crisisKeywords = {
  suicide: [
    'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
    'not worth living', 'better off dead', 'end it all', 'take my life',
    'no reason to live', 'want to disappear', 'harm myself'
  ],
  selfHarm: [
    'hurt myself', 'cut myself', 'self harm', 'self-harm', 'injure myself',
    'pain myself', 'punish myself'
  ],
  severe: [
    'can\'t go on', 'give up', 'no hope', 'hopeless', 'worthless',
    'burden to everyone', 'everyone would be better without me',
    'can\'t take it anymore', 'too much pain'
  ]
};

class CrisisDetectionService {
  /**
   * Analyze conversation for crisis indicators
   * @param {Array} messages - Array of conversation messages
   * @returns {Object} Crisis analysis result
   */
  analyzeConversation(messages) {
    let crisisScore = 0;
    let detectedKeywords = [];
    let crisisLevel = 'none'; // none, low, medium, high, critical
    
    // Combine all user messages
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content.toLowerCase())
      .join(' ');

    // Check for suicide keywords (highest priority)
    crisisKeywords.suicide.forEach(keyword => {
      if (userMessages.includes(keyword)) {
        crisisScore += 10;
        detectedKeywords.push(keyword);
      }
    });

    // Check for self-harm keywords
    crisisKeywords.selfHarm.forEach(keyword => {
      if (userMessages.includes(keyword)) {
        crisisScore += 7;
        detectedKeywords.push(keyword);
      }
    });

    // Check for severe distress keywords
    crisisKeywords.severe.forEach(keyword => {
      if (userMessages.includes(keyword)) {
        crisisScore += 3;
        detectedKeywords.push(keyword);
      }
    });

    // Determine crisis level
    if (crisisScore >= 10) {
      crisisLevel = 'critical'; // Immediate intervention needed
    } else if (crisisScore >= 7) {
      crisisLevel = 'high'; // Urgent attention needed
    } else if (crisisScore >= 4) {
      crisisLevel = 'medium'; // Monitoring needed
    } else if (crisisScore >= 2) {
      crisisLevel = 'low'; // Mild concern
    }

    return {
      isCrisis: crisisScore >= 10,
      crisisLevel,
      crisisScore,
      detectedKeywords: [...new Set(detectedKeywords)],
      requiresIntervention: crisisScore >= 10,
      timestamp: new Date()
    };
  }

  /**
   * Generate crisis summary for emergency contact
   * @param {Object} user - User information
   * @param {Array} messages - Conversation messages
   * @param {Object} crisisAnalysis - Crisis analysis result
   * @returns {String} Summary text
   */
  generateCrisisSummary(user, messages, crisisAnalysis) {
    const recentMessages = messages
      .filter(msg => msg.role === 'user')
      .slice(-5)
      .map(msg => msg.content)
      .join('. ');

    return `Emergency alert for ${user.name}. 
    Crisis level: ${crisisAnalysis.crisisLevel}. 
    Detected indicators: ${crisisAnalysis.detectedKeywords.join(', ')}. 
    Recent conversation context: ${recentMessages}. 
    This person may be in immediate danger and requires urgent attention. 
    Please contact them immediately or call emergency services if you cannot reach them.`;
  }

  /**
   * Get crisis resources
   * @returns {Object} Crisis hotline numbers
   */
  getCrisisResources() {
    return {
      us: {
        suicide: '988', // 988 Suicide & Crisis Lifeline
        crisis: '1-800-273-8255',
        text: 'Text HOME to 741741'
      },
      international: {
        suicide: '988',
        crisis: '1-800-273-8255'
      }
    };
  }
}

module.exports = new CrisisDetectionService();
