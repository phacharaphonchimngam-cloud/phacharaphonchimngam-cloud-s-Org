import {
  CharacterId,
  CharacterMatchScore,
  DynamicQuizAnalysis,
  Question,
  QuizResultRecord,
  UserAnswerRecord,
} from '../types/quiz';
import { CHARACTERS_MAP, getVerifiedCharacter, verifyCharacterIntegrity } from '../data/characters';
import { QUESTION_BANK } from '../data/questionBank';
import { StorageService } from './storage';

/**
 * Randomly samples 15 unique questions from the question bank (stored/customized)
 */
export function sampleRandomQuestions(count = 15): Question[] {
  const bankCopy = StorageService.getQuestions();
  // Fisher-Yates shuffle
  for (let i = bankCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bankCopy[i], bankCopy[j]] = [bankCopy[j], bankCopy[i]];
  }
  return bankCopy.slice(0, Math.min(count, bankCopy.length));
}

/**
 * Calculates scores, ranks, percentages and dynamic text analysis from answers
 * Gracefully excludes any questions marked as unscored (isScored === false)
 */
export function calculateQuizResult(
  userId: string,
  answers: UserAnswerRecord[]
): QuizResultRecord {
  // Initialize scores for all 6 mane characters
  const rawScores: Record<CharacterId, number> = {
    twilight_sparkle: 0,
    rainbow_dash: 0,
    pinkie_pie: 0,
    fluttershy: 0,
    rarity: 0,
    applejack: 0,
  };

  const traitFrequency: Record<string, number> = {};

  // Filter only answers that count towards scoring!
  // Any answer with isScored === false is strictly excluded from pony scoring
  const scoredAnswers = answers.filter((ans) => ans.isScored !== false);

  scoredAnswers.forEach((ans) => {
    // Accumulate pony scores
    for (const [charId, score] of Object.entries(ans.scores)) {
      rawScores[charId as CharacterId] += score;
    }
    // Track chosen traits for deep personalized analysis
    if (ans.primaryTrait) {
      traitFrequency[ans.primaryTrait] = (traitFrequency[ans.primaryTrait] || 0) + 1;
    }
  });

  // Calculate percentages
  const scoreEntries = Object.entries(rawScores) as [CharacterId, number][];
  const maxScore = Math.max(...scoreEntries.map(([, s]) => s), 1);
  const minScore = Math.min(...scoreEntries.map(([, s]) => s));

  // Sort descending
  scoreEntries.sort((a, b) => b[1] - a[1]);

  // Transform to percentage with natural bell-curve scaling relative to scored questions
  const effectiveScoredCount = Math.max(scoredAnswers.length, 1);
  const rankedCharacters: CharacterMatchScore[] = scoreEntries.map(([charId, score], idx) => {
    const canonical = getVerifiedCharacter(charId);

    // Dynamic percent formula:
    const relativeRatio = maxScore > minScore ? (score - minScore) / (maxScore - minScore) : 0.8;
    let percentage = Math.round(62 + relativeRatio * 28 + (score / (effectiveScoredCount * 3)) * 8);

    // Ensure strictly descending or equal percentages
    if (idx === 0) {
      percentage = Math.max(82, Math.min(97, percentage));
    } else {
      percentage = Math.max(45, Math.min(percentage, 91 - idx * 6));
    }

    return {
      characterId: charId,
      name: canonical.name,
      displayName: canonical.displayName,
      thaiName: canonical.thaiName,
      image: canonical.image,
      score,
      percentage,
    };
  });

  const topMatch = rankedCharacters[0];
  const secondMatch = rankedCharacters[1];
  const thirdMatch = rankedCharacters[2];

  // Generate dynamic customized textual analysis based on user's specific answers
  const dynamicAnalysis = generatePersonalizedAnalysis(topMatch.characterId, secondMatch.characterId, answers, traitFrequency);

  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);

  const resultRecord: QuizResultRecord = {
    id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId,
    createdAt: now.toISOString(),
    formattedDate,
    answers,
    rawScores,
    rankedCharacters,
    topCharacter: topMatch,
    secondCharacter: secondMatch,
    thirdCharacter: thirdMatch,
    dynamicAnalysis,
  };

  // Integrity assertion check
  const topCanonical = getVerifiedCharacter(resultRecord.topCharacter.characterId);
  if (!verifyCharacterIntegrity(topCanonical)) {
    console.error('Character integrity check failed for', topMatch.characterId);
  }

  return resultRecord;
}

/**
 * Dynamically synthesizes text explaining:
 * 1. Why you match this character based on actual answers
 * 2. Deep personalized persona analysis
 * 3. Tailored personal advice
 */
function generatePersonalizedAnalysis(
  topCharId: CharacterId,
  secondCharId: CharacterId,
  answers: UserAnswerRecord[],
  traitFreq: Record<string, number>
): DynamicQuizAnalysis {
  const topPony = getVerifiedCharacter(topCharId);
  const secondPony = getVerifiedCharacter(secondCharId);

  // Extract top traits chosen by user
  const sortedTraits = Object.entries(traitFreq).sort((a, b) => b[1] - a[1]);
  const dominantTraitKeys = sortedTraits.slice(0, 3).map(([k]) => k);

  const traitLabels: Record<string, string> = {
    analytical: 'การคิดวิเคราะห์อย่างมีเหตุผลและเป็นระบบ',
    action_oriented: 'ความกล้าหาญ การตัดสินใจฉับไว และพร้อมลุยเคียงข้างเพื่อน',
    fun_loving: 'พลังบวก อารมณ์ขัน และการสร้างรอยยิ้มให้คนรอบตัว',
    empathetic: 'ความอ่อนโยน การรับฟังอย่างลึกซึ้ง และความเข้าอกเข้าใจ',
    aesthetic: 'ความประณีต รสนิยมที่ดี และการใส่ใจในรายละเอียดความงาม',
    practical: 'ความซื่อสัตย์ ความขยันติดดิน และการลงมือทำจริง',
    organized: 'ความมีระเบียบวินัย การวางแผนรอบคอบ และความรับผิดชอบสูง',
    peaceful: 'ความรักความสงบ การอยู่ร่วมกับธรรมชาติ และหลีกเลี่ยงความขัดแย้ง',
    generous: 'ความเอื้อเฟื้อเผื่อแผ่ และการแบ่งปันความสุขให้ผู้อื่น',
    fast_paced: 'ความกระฉับกระเฉง ความว่องไว และรักความท้าทายใหม่ ๆ',
  };

  const dominantTraitDescriptions = dominantTraitKeys
    .map((k) => traitLabels[k])
    .filter(Boolean);

  // Dynamic "ทำไมคุณถึงคล้าย..." based on actual answers
  let whyYouAreLikeThis = '';
  if (topCharId === 'twilight_sparkle') {
    whyYouAreLikeThis = `จากคำตอบทั้ง 15 ข้อของคุณ สะท้อนให้เห็นว่าคุณมักให้ความสำคัญกับ${dominantTraitDescriptions.join(' รวมถึง')} คุณมีแนวโน้มที่จะคิดก่อนตัดสินใจ มองหาข้อมูลที่ชัดเจน และชอบวางแผนอย่างเป็นขั้นตอนเมื่อเผชิญกับสถานการณ์ที่ไม่แน่นอน นอกจากนี้คุณยังเป็นคนที่เพื่อน ๆ พึ่งพาได้เสมอเมื่อต้องการคำปรึกษาที่มีหลักการ จึงทำให้บุคลิกภาพ วิธีคิด และการใช้ชีวิตของคุณมีความสอดคล้องกับ Twilight Sparkle อย่างเด่นชัด`;
  } else if (topCharId === 'rainbow_dash') {
    whyYouAreLikeThis = `จากคำตอบทั้งหมดที่คุณเลือก คุณเป็นคนที่มีพลังขับเคลื่อนสูงมาก โดดเด่นในเรื่อง${dominantTraitDescriptions.join(' และ')} คุณไม่ชอบการอยู่นิ่ง ๆ ชอบความท้าทาย และพร้อมพุ่งชนอุปสรรคเพื่อปกป้องเพื่อนฝูง ความซื่อตรงและความภักดีต่อมิตรภาพที่สะท้อนออกมาในสถานการณ์ต่าง ๆ ทำให้คุณมีจิตวิญญาณแห่งความกล้าหาญที่ใกล้เคียงกับ Rainbow Dash มากที่สุด`;
  } else if (topCharId === 'pinkie_pie') {
    whyYouAreLikeThis = `จากคำตอบที่คุณเลือกตลอดแบบทดสอบ คุณมองโลกด้วยสายตาที่สดใสและเปี่ยมด้วยพลังแห่งความสุข โดดเด่นเรื่อง${dominantTraitDescriptions.join(' ตลอดจน')} คุณมักมองหาแง่มุมที่สนุกสนานในทุกสถานการณ์ และใส่ใจที่จะทำให้คนรอบข้างรู้สึกสบายใจและยิ้มได้ พลังบวกและความคิดนอกกรอบที่ไม่เหมือนใครของคุณสะท้อนตัวตนของ Pinkie Pie ได้อย่างสมบูรณ์แบบ`;
  } else if (topCharId === 'fluttershy') {
    whyYouAreLikeThis = `จากคำตอบของคุณ แสดงให้เห็นถึงหัวใจที่เปี่ยมด้วยความเมตตาอย่างแท้จริง โดยเฉพาะเรื่อง${dominantTraitDescriptions.join(' และ')} คุณเป็นผู้ฟังที่อบอุ่น ไม่ชอบความขัดแย้ง และรักความสงบ แม้บางครั้งคุณอาจดูถ่อมตนและขี้อาย แต่เมื่อถึงเวลาที่ต้องปกป้องคนที่คุณรัก คุณจะรวบรวมความกล้าหาญออกมาได้อย่างน่าประทับใจ เช่นเดียวกับ Fluttershy ผู้พิทักษ์สรรพสัตว์`;
  } else if (topCharId === 'rarity') {
    whyYouAreLikeThis = `จากคำตอบที่คุณเลือก คุณเป็นคนที่มีรสนิยมประณีตและมีสายตาที่มองเห็นคุณค่าในสิ่งต่าง ๆ โดดเด่นในด้าน${dominantTraitDescriptions.join(' ควบคู่กับ')} คุณมีความตั้งใจในการทำงานให้ออกมาสมบูรณ์แบบและสง่างาม ที่สำคัญคุณพร้อมจะเสียสละและแบ่งปันสิ่งที่ดีที่สุดให้คนอื่นอย่างเอื้อเฟื้อเผื่อแผ่ ความมีเสน่ห์และน้ำใจอันกว้างขวางนี้จึงตรงกับ Rarity อย่างที่สุด`;
  } else {
    // applejack
    whyYouAreLikeThis = `จากคำตอบของคุณ คุณเป็นคนที่มีความจริงใจ มั่นคง และพึ่งพาได้มากที่สุด โดดเด่นเรื่อง${dominantTraitDescriptions.join(' และ')} คุณให้คุณค่ากับความซื่อสัตย์ การรักษาคำพูด และการลงมือทำงานหนักเพื่อความสำเร็จที่แท้จริง คุณไม่ชอบเรื่องเสแสร้งและพร้อมเป็นที่พึ่งให้เพื่อนเสมอ ลักษณะความติดดินและความซื่อตรงนี้คือแก่นแท้ของ Applejack อย่างแท้จริง`;
  }

  // Dynamic user persona analysis
  let userPersona = '';
  const secondName = secondPony.name;
  userPersona = `คุณเป็นคนที่มีบุคลิกภาพหลักคล้าย ${topPony.name} ผสมผสานกับเสน่ห์รองของ ${secondName} คุณมีจุดเด่นในการใช้ชีวิตที่เน้น ${dominantTraitDescriptions[0] || 'การทำความเข้าใจสิ่งต่าง ๆ'} เป็นตัวขับเคลื่อน คุณเป็นเพื่อนประเภทที่เมื่อใครได้รู้จักแล้วจะรู้สึกอบอุ่นใจ เพราะคุณมีความชัดเจนในจุดยืน ไม่เอาเปรียบใคร และมักคำนึงถึงความรู้สึกหรือความถูกต้องของสิ่งที่ทำเสมอ`;

  // Custom advice
  let customAdvice = '';
  if (topCharId === 'twilight_sparkle') {
    customAdvice = `คุณมีสติปัญญาและการวางแผนที่ยอดเยี่ยมเป็นอาวุธสำคัญ ลองใช้จุดแข็งนี้สร้างสรรค์สิ่งดี ๆ แต่อย่ากดดันตัวเองจนเกินไปว่าทุกอย่างในชีวิตต้องสมบูรณ์แบบหรือเป็นไปตามแผน 100% การปล่อยวางและเปิดพื้นที่ให้ความผิดพลาดบ้าง คือบทเรียนมิตรภาพที่สวยงามที่สุด`;
  } else if (topCharId === 'rainbow_dash') {
    customAdvice = `ความกล้าหาญและความมั่นใจของคุณคือแรงบันดาลใจให้คนรอบข้าง ลองฝึกการชะลอจังหวะ หายใจลึก ๆ และรับฟังความรู้สึกของคนที่อาจก้าวตามคุณไม่ทัน การเป็นผู้นำที่ยิ่งใหญ่ไม่ได้อยู่ที่การไปถึงเส้นชัยเป็นคนแรก แต่อยู่ที่การจับมือและก้าวไปพร้อมกับเพื่อน ๆ`;
  } else if (topCharId === 'pinkie_pie') {
    customAdvice = `รอยยิ้มของคุณคือยาวิเศษที่เยียวยาผู้คน แต่อย่าลืมว่าคุณไม่จำเป็นต้องแบกรับหน้าที่สร้างความสุขให้ทุกคนตลอดเวลา อนุญาตให้ตัวเองได้พัก เหนื่อย หรือรู้สึกเศร้าได้บ้าง เพื่อนที่รักคุณพร้อมจะรับฟังและดูแลคุณในวันที่คุณหมดพลังเสมอ`;
  } else if (topCharId === 'fluttershy') {
    customAdvice = `ความอ่อนโยนและความเข้าอกเข้าใจของคุณคือพลังที่แสนอบอุ่น จงเชื่อมั่นในคุณค่าของตัวเองให้มากขึ้น อย่ากลัวที่จะปฏิเสธในสิ่งที่คุณไม่สบายใจ และกล้าเปล่งเสียงบอกความต้องการของคุณออกมา เพราะโลกนี้ต้องการความเมตตาที่มาพร้อมความมั่นใจของคุณ`;
  } else if (topCharId === 'rarity') {
    customAdvice = `รสนิยมและความเอื้อเฟื้อของคุณทำให้ทุกสิ่งรอบตัวเปล่งประกาย แต่ระวังอย่าให้ความต้องการความสมบูรณ์แบบและภาพลักษณ์ภายนอกมาสร้างความเหนื่อยล้าให้หัวใจ จงจำไว้ว่าสิ่งที่มีค่าที่สุดไม่ใช่สิ่งของที่ไร้ที่ติ แต่อยู่ที่ความจริงใจและความสบายใจในแบบของคุณ`;
  } else {
    // applejack
    customAdvice = `ความซื่อตรงและความขยันขันแข็งของคุณคือรากฐานที่แข็งแกร่งที่สุด แต่อย่าดื้อรั้นจนแบกรับภาระทุกอย่างไว้บนบ่าเพียงคนเดียว การเปิดใจขอความช่วยเหลือจากเพื่อนไม่ได้แปลว่าคุณอ่อนแอ แต่มันคือการเปิดโอกาสให้ความรักและมิตรภาพได้หมุนเวียนกลับมาหาคุณ`;
  }

  return {
    whyYouAreLikeThis,
    userPersona,
    customAdvice,
    dominantTraits: dominantTraitDescriptions,
  };
}
