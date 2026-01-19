
import json
import os

files = [
    "yinhang.json", "yinsi.json", "yinyangguaiqi.json", "yishigan.json", "yitaifang.json", 
    "yitaijingdian.json", "yong.json", "you.json", "youdiaodiao.json", "youhua.json", 
    "youxi.json", "youzi.json", "yu.json", "yuan.json", "yue.json", "yun.json", 
    "yuyin.json", "yuzhaizu.json", "yyds.json", "zai.json", "zan.json", "zao.json", 
    "ze.json", "zenme.json", "zhainan.json", "zhalie.json", "zhan.json", "zhang.json", 
    "zhao.json", "zhe.json", "zhen.json", "zhende.json", "zheng.json", "zhenghuo.json", 
    "zhenxiang.json", "zhi.json", "zhibo.json", "zhichi.json", "zhiquansaorao.json", 
    "zhong.json", "zhongcao.json", "zhongchou.json", "zhou.json", "zhu.json", "zhuangb.json", 
    "zhui.json", "zhun.json", "zi.json", "zou.json", "zqsg.json", "zu.json", "zuo.json"
]

translations = {
    "yinhang.json": {
        "en": {"m": "Non-performing loan (NPL)", "d": "Loans that are in default or close to being in default.", "c": "Finance/Investment", "ex": ["Bank NPL ratio rising", "Disposing of NPLs takes time", "Regulators require disclosure of NPL details"]},
        "ko": {"m": "부실채권", "d": "은행이 보유한 회수 곤란한 대출 자산.", "c": "금융/투자", "ex": ["은행의 부실채권 비율이 상승하고 있다", "부실채권 처리는 시간이 걸린다", "감독 당국은 부실채권 현황 공개를 요구하고 있다"]},
        "th": {"m": "หนี้เสีย (NPL)", "d": "สินทรัพย์สินเชื่อที่ธนาคารกู้คืนได้ยาก", "c": "การเงิน/การลงทุน", "ex": ["อัตราส่วนหนี้เสียของธนาคารเพิ่มขึ้น", "การจัดการหนี้เสียต้องใช้เวลา", "หน่วยงานกำกับดูแลต้องการให้เปิดเผยรายละเอียดหนี้เสีย"]}
    },
    "yinsi.json": {
        "en": {"m": "Privacy / Expectation of privacy", "d": "Usually used to describe a lack of privacy.", "c": "Uncategorized", "ex": ["In the big data era, individuals have no privacy at all", "Cameras in the office? Too scary, where is the privacy?", "Mobile payments leave no privacy, every expense is clearly recorded"]},
        "ko": {"m": "사생활 / 프라이버시", "d": "개인의 사생활이나 비밀.", "c": "미분류", "ex": ["빅데이터 시대에 개인은 사생활이 전혀 없다", "사무실에 카메라 설치? 너무 무섭다, 사생활이 어디 있어?", "모바일 결제는 사생활이 없다, 모든 소비가 명확히 기록된다"]},
        "th": {"m": "ความเป็นส่วนตัว", "d": "ความเป็นส่วนตัว ความลับในชีวิตส่วนตัว", "c": "ไม่ระบุหมวดหมู่", "ex": ["ในยุค Big Data ความเป็นส่วนตัวของบุคคลแทบไม่มีเหลือ", "ติดกล้องในออฟฟิศ? น่ากลัวเกินไป ความเป็นส่วนตัวอยู่ที่ไหน", "การชำระเงินผ่านมือถือไม่มีความเป็นส่วนตัว ทุกยอดการใช้จ่ายถูกบันทึกไว้อย่างชัดเจน"]}
    },
    "yinyangguaiqi.json": {
        "en": {"m": "Sarcastic / Passive-aggressive", "d": "Speaking in a way that sounds polite but is actually mocking or cynical.", "c": "Internet Slang", "ex": ["He speaks so sarcastically"]},
        "ko": {"m": "비꼬다 / 빈정거리다", "d": "겉으로는 칭찬하는 척하며 은근히 깎아내리는 화법.", "c": "인터넷 은어", "ex": ["그는 말을 아주 비꼬듯이 한다"]},
        "th": {"m": "ประชดประชัน / แดกดัน", "d": "พูดจาเหน็บแนม แกล้งชมแต่จริงๆ ด่า", "c": "ศัพท์สแลงเน็ต", "ex": ["เขาพูดจาประชดประชัน"]}
    },
    "yishigan.json": {
        "en": {"m": "Sense of ritual", "d": "The feeling of making life special or paying attention to details.", "c": "Lifestyle", "ex": ["Life needs a sense of ritual"]},
        "ko": {"m": "의식감 / 특별한 느낌", "d": "생활을 정성스럽게 연출하는 감각이나 고집.", "c": "라이프스타일", "ex": ["인생에는 의식감이 필요하다"]},
        "th": {"m": "ความรู้สึกพิเศษ / มีพิธีรีตอง", "d": "ความรู้สึกใส่ใจในรายละเอียดเพื่อทำให้ชีวิตดูพิเศษ", "c": "ไลฟ์สไตล์", "ex": ["ชีวิตต้องมีความรู้สึกพิเศษ (มีพิธีรีตอง)"]}
    },
    "yitaifang.json": {
        "en": {"m": "Ethereum", "d": "Decentralized platform with smart contracts. Currency is ETH.", "c": "Finance/Investment", "ex": ["Ethereum upgrade improved efficiency", "Deploy smart contracts on Ethereum", "ETH gas fees have dropped"]},
        "ko": {"m": "이더리움", "d": "스마트 계약 기능을 갖춘 분산형 플랫폼. 통화는 ETH.", "c": "금융/투자", "ex": ["이더리움 업그레이드로 효율성이 향상되었다", "이더리움에 스마트 계약을 배포하다", "이더리움 수수료가 내려갔다"]},
        "th": {"m": "อีเธอเรียม", "d": "แพลตฟอร์มแบบกระจายศูนย์ที่มีฟังก์ชันสัญญาอัจฉริยะ สกุลเงินคือ ETH", "c": "การเงิน/การลงทุน", "ex": ["การอัปเกรดอีเธอเรียมช่วยปรับปรุงประสิทธิภาพ", "ติดตั้งสัญญาอัจฉริยะบนอีเธอเรียม", "ค่าแก๊ส ETH ลดลงแล้ว"]}
    },
    "yitaijingdian.json": {
        "en": {"m": "Ethereum Classic", "d": "Blockchain resulting from a hard fork of Ethereum (ETH).", "c": "Finance/Investment", "ex": ["Ethereum Classic price up", "Discussing ETC mining difficulty", "Exchange lists Ethereum Classic"]},
        "ko": {"m": "이더리움 클래식", "d": "이더리움(ETH)의 하드포크로 분리된 블록체인.", "c": "금융/투자", "ex": ["이더리움 클래식 가격 상승", "ETC 채굴 난이도 토론", "거래소가 이더리움 클래식을 상장했다"]},
        "th": {"m": "อีเธอเรียมคลาสสิก", "d": "บล็อกเชนที่แยกตัวออกมาจากการ Hard Fork ของอีเธอเรียม (ETH)", "c": "การเงิน/การลงทุน", "ex": ["อีเธอเรียมคลาสสิกราคาขึ้น", "พูดคุยเกี่ยวกับความยากในการขุด ETC", "กระดานเทรดลิสต์อีเธอเรียมคลาสสิก"]}
    },
    "yong.json": {
        "en": {"m": "Never ending / Curtain never falls", "d": "Something that lasts forever.", "c": "Uncategorized", "ex": ["Hope our happiness never ends", "My love for you is like the waves, never ending", "Her beauty never fades, truly sweet"]},
        "ko": {"m": "영원히 막을 내리지 않다 / 끝이 없다", "d": "무언가가 끝나지 않고 영원히 계속됨을 나타냄.", "c": "미분류", "ex": ["우리의 즐거움이 영원히 끝나지 않기를", "너에 대한 내 사랑은 파도처럼 영원하다", "그녀의 미모는 끝이 없다, 정말 달콤하다"]},
        "th": {"m": "ไม่มีวันจบสิ้น / ปิดฉากไม่ลง", "d": "เปรียบเปรยถึงสิ่งที่ดำเนินต่อไปตลอดกาล", "c": "ไม่ระบุหมวดหมู่", "ex": ["หวังว่าความสุขของพวกเราจะไม่มีวันจบสิ้น", "ความรักที่ฉันมีให้เธอเหมือนเกลียวคลื่น ไม่มีวันจบสิ้น", "ความสวยของเธอไม่มีวันจืดจาง หวานจริงๆ"]}
    },
    "you.json": {
        "en": {"m": "Cool and Sassy", "d": "'A' (Alpha) means cool/dominant. 'Sa' means sassy/chic. Describes a confident and cool style/person.", "c": "Internet Slang", "ex": ["Cool and sassy outfit", "Cool and sassy boss lady", "She is truly cool and sassy", "Cool, beautiful, sassy and sexy"]},
        "ko": {"m": "쿨하고 멋지다 (A하고 Sa하다)", "d": "A는 Alpha(상남자/걸크러시), Sa는 씩씩하고 멋진 모습. 자신감 있고 당당한 스타일.", "c": "인터넷 은어", "ex": ["쿨하고 멋진 코디", "쿨하고 멋진 여사장님", "그녀는 정말 쿨하고 멋지다", "쿨하고 멋지고 예쁘고 섹시하다"]},
        "th": {"m": "เท่และมั่นใจ / คูลและสวยสตรอง", "d": "A มาจาก Alpha (เท่/ผู้นำ) Sa คือมีความมั่นใจ โฉบเฉี่ยว", "c": "ศัพท์สแลงเน็ต", "ex": ["การแต่งตัวที่ทั้งเท่และมั่นใจ", "เจ้านายหญิงที่ทั้งเท่และเก่ง", "เธอทั้งเท่และมั่นใจจริงๆ", "ทั้งเท่ ทั้งคูล ทั้งสวย ทั้งมั่น ทั้งเซ็กซี่"]}
    },
    "youdiaodiao.json": {
        "en": {"m": "Classy / Atmospheric", "d": "Having a specific tone, good taste, or vibe.", "c": "Fashion/Atmosphere", "ex": ["This cafe is very atmospheric", "She dresses with great style"]},
        "ko": {"m": "분위기 있다 / 센스 있다", "d": "독특한 느낌이나 좋은 센스를 가지고 있다.", "c": "패션/분위기", "ex": ["이 카페는 분위기가 있다", "그녀는 옷 입는 센스가 있다"]},
        "th": {"m": "มีสไตล์ / มีรสนิยม / มีบรรยากาศ", "d": "มีโทนหรือสไตล์ที่ดี มักใช้ชมการแต่งตัวหรือตกแต่ง", "c": "แฟชั่น/บรรยากาศ", "ex": ["คาเฟ่นี้มีสไตล์มาก", "เธอแต่งตัวมีสไตล์มาก"]}
    },
    "youhua.json": {
        "en": {"m": "Spit it out / Speak up", "d": "Critique for someone hesitating to speak. Literally: 'If you have words, say them; if you have gas, release it.'", "c": "Idioms", "ex": ["Spit it out, stop teasing with previews, it's annoying", "Spit it out, don't be awkward, nobody likes you like that", "Spit it out, good or bad, let everyone discuss it"]},
        "ko": {"m": "할 말 있으면 빨리 해라", "d": "직역하면 '말이 있으면 하고 방귀가 있으면 뀌어라'. 뜸 들이지 말고 시원하게 말하라는 뜻.", "c": "성어/사자성어", "ex": ["할 말 있으면 빨리 해, 예고만 하지 말고 짜증나니까", "할 말 있으면 해, 쭈뼛거리지 마, 아무도 너 안 좋아해", "할 말 있으면 해, 좋든 나쁘든 대중이 토론하게 해라"]},
        "th": {"m": "มีอะไรก็พูดมา", "d": "แปลตรงตัวคือ 'มีคำพูดก็พูดมา มีตดก็ปล่อยมา' ใช้เร่งให้อีกฝ่ายพูดตรงๆ", "c": "สำนวน", "ex": ["มีอะไรก็พูดมา อย่ามัวแต่เกริ่น น่ารำคาญ", "มีอะไรก็พูดมา อย่าทำตัวอึกอัก ไม่มีใครชอบหรอก", "มีอะไรก็พูดมา ดีหรือไม่ดี ให้ทุกคนช่วยกันวิจารณ์"]}
    },
    "youxi.json": {
        "en": {"m": "Deeply worried / Anxious", "d": "Heavy-hearted with worry.", "c": "Idioms", "ex": ["I look at the future with deep worry", "Does the Double Reduction policy affect grades? Parents are deeply worried", "Thinking about many things carefully makes one anxious"]},
        "ko": {"m": "우심충충 / 근심이 가득하다", "d": "걱정으로 마음이 무겁다.", "c": "성어/사자성어", "ex": ["나는 우심충충하게 미래를 바라본다", "쌍감 정책이 성적에 영향을 줄까? 학부모들은 우심충충하다", "많은 일을 자세히 생각하면 우심충충해진다"]},
        "th": {"m": "กังวลใจอย่างมาก / ทุกข์ใจหนัก", "d": "มีความกังวลเต็มหัวใจ", "c": "สำนวน", "ex": ["ฉันมองอนาคตด้วยความกังวลใจอย่างมาก", "นโยบายลดการบ้านและเรียนพิเศษมีผลต่อเกรดไหม? ผู้ปกครองกังวลใจมาก", "พอคิดถึงเรื่องต่างๆ อย่างละเอียด ก็เริ่มกังวลใจ"]}
    },
    "youzi.json": {
        "en": {"m": "EOS", "d": "Refers to the cryptocurrency EOS (Operating System).", "c": "Finance/Investment", "ex": ["He is studying the EOS ecosystem", "How to use EOS wallet?", "EOS price fluctuates greatly"]},
        "ko": {"m": "이오스 (EOS)", "d": "일반적으로는 유자(과일)이나 여기서는 암호화폐 EOS를 의미.", "c": "금융/투자", "ex": ["그는 이오스 생태계를 연구하고 있다", "이오스 지갑 어떻게 써요?", "이오스 가격 변동이 크다"]},
        "th": {"m": "EOS", "d": "ปกติหมายถึงส้มโอ แต่ในที่นี้หมายถึงเหรียญ EOS", "c": "การเงิน/การลงทุน", "ex": ["เขากำลังศึกษาระบบนิเวศของ EOS", "กระเป๋าเงิน EOS ใช้อย่างไร?", "ราคา EOS ผันผวนมาก"]}
    },
    "yu.json": {
        "en": {"m": "Original paint / Condition", "d": "(Used car) No repairs, accidents, or repainting.", "c": "Automotive", "ex": ["Whole car original paint, no accidents, drive away with 90k+", "Selling car, 2020 model, Jan 2020 registered, original paint", "43k km real mileage, original tires, original paint, one owner"]},
        "ko": {"m": "완전 무사고 / 원칠", "d": "(중고차) 수리나 재도색 이력 없이 독자적인 상태 그대로임.", "c": "자동차", "ex": ["차량 전체 원칠, 무사고, 9만 킬로 주행", "차 팝니다, 2020년형, 2020년 1월 등록, 완전 무사고", "4.3만, 실주행, 순정 타이어, 완전 무사고, 1인 신조"]},
        "th": {"m": "สภาพเดิม / สีเดิม", "d": "(รถมือสอง) ไม่มีประวัติซ่อมแซมหรือทำสีใหม่ สภาพเดิมจากโรงงาน", "c": "ยานยนต์", "ex": ["สีเดิมทั้งคัน ไม่มีอุบัติเหตุ วิ่งไป 9 หมื่นกว่า", "ขายรถ รุ่นปี 2020 จดทะเบียนม.ค. 2020 สีเดิมโรงงาน", "ไมล์แท้ 4.3 หมื่น ยางเดิม สีเดิม เจ้าของมือเดียว"]}
    },
    "yuan.json": {
        "en": {"m": "Original paint / Condition", "d": "(Used car) No repairs, accidents, or repainting.", "c": "Automotive", "ex": ["Whole car original paint, no accidents, drive away with 90k+", "Selling car, 2020 model, Jan 2020 registered, original paint", "43k km real mileage, original tires, original paint, one owner"]},
        "ko": {"m": "완전 무사고 / 원칠", "d": "(중고차) 수리나 재도색 이력 없이 독자적인 상태 그대로임.", "c": "자동차", "ex": ["차량 전체 원칠, 무사고, 9만 킬로 주행", "차 팝니다, 2020년형, 2020년 1월 등록, 완전 무사고", "4.3만, 실주행, 순정 타이어, 완전 무사고, 1인 신조"]},
        "th": {"m": "สภาพเดิม / สีเดิม", "d": "(รถมือสอง) ไม่มีประวัติซ่อมแซมหรือทำสีใหม่ สภาพเดิมจากโรงงาน", "c": "ยานยนต์", "ex": ["สีเดิมทั้งคัน ไม่มีอุบัติเหตุ วิ่งไป 9 หมื่นกว่า", "ขายรถ รุ่นปี 2020 จดทะเบียนม.ค. 2020 สีเดิมโรงงาน", "ไมล์แท้ 4.3 หมื่น ยางเดิม สีเดิม เจ้าของมือเดียว"]}
    },
    "yue.json": {
        "en": {"m": "Duplex / Maisonette", "d": "Apartment unit with internal stairs connecting two floors.", "c": "Housing/Interior", "ex": ["Duplex one bedroom", "3 bedrooms, 190 sqm, duplex, with garden and garage", "Do you really know the difference between 'Loft' and 'Duplex'?"]},
        "ko": {"m": "복층 / 메조넷", "d": "아파트 내부에 계단이 있는 복층 구조.", "c": "주거/인테리어", "ex": ["복층 원룸", "방 3개, 190평방미터, 복층, 정원 및 차고 포함", "복층형과 메조넷의 차이를 정말 아시나요?"]},
        "th": {"m": "ดูเพล็กซ์ / เมโซเนต", "d": "ห้องชุดที่มีบันไดภายในเชื่อมต่อสองชั้น", "c": "ที่อยู่อาศัย/การตกแต่งภายใน", "ex": ["ดูเพล็กซ์ 1 ห้องนอน", "3 ห้องนอน 190 ตร.ม. ดูเพล็กซ์ มีสวนและโรงรถ", "คุณรู้ความแตกต่างระหว่าง 'Loft' และ 'Duplex' จริงๆ หรือไม่"]}
    },
    "yun.json": {
        "en": {"m": "Dizzy / Faint / Confused", "d": "Feeling dizzy or overwhelmed.", "c": "Internet Slang", "ex": ["Tired to the point of fainting today", "Hot day, I'm dizzy", "This person really makes me laugh till I faint", "Cold... slept groggily all day, dizzy", "Why still thinking about plans? Really dizzy"]},
        "ko": {"m": "어지럽다 / 기절초풍하다", "d": "정신이 없거나 멍한 상태.", "c": "인터넷 은어", "ex": ["오늘 피곤해서 기절하겠다", "날씨 더워서 어지럽다", "이 사람 때문에 웃겨서 기절하겠다", "감기... 하루 종일 몽롱하게 잤더니 어지럽다", "왜 아직도 기획안 생각해야 해? 진짜 머리 아프다"]},
        "th": {"m": "มึนงง / หน้ามืด / จะเป็นลม", "d": "รู้สึกเวียนหัวหรือสับสน", "c": "ศัพท์สแลงเน็ต", "ex": ["วันนี้เหนื่อยจนจะเป็นลม", "อากาศร้อน ฉันหน้ามืดแล้ว", "คนนี้ทำฉันขำจนจะเกร็ง", "เป็นหวัด... นอนซึมทั้งวัน มึนหัว", "ทำไมต้องคิดแผนอีก? ปวดหัวจะตายอยู่แล้ว"]}
    },
    "yuyin.json": {
        "en": {"m": "Playing hard to get", "d": "Wanting to welcome/accept but pretending to refuse.", "c": "Idioms", "ex": ["How to spot a girl playing hard to get", "Tip to capture a man's heart: play hard to get dates", "Don't play hard to get when someone gives you a gift"]},
        "ko": {"m": "밀당하다 / 거절하는 척하다", "d": "속으로는 좋으면서 겉으로는 거절하는 태도.", "c": "성어/사자성어", "ex": ["여자가 밀당하는 것을 어떻게 간파하나", "남자를 사로잡는 팁: 데이트에서 밀당하기", "선물을 줄 때 거절하는 척하지 마라"]},
        "th": {"m": "แกล้งปฏิเสธ / เล่นตัว", "d": "ใจจริงอยากรับแต่แกล้งทําเป็นปฏิเสธ", "c": "สำนวน", "ex": ["วิธีดูผู้หญิงที่แกล้งเล่นตัว", "เคล็ดลับมัดใจชาย: แกล้งปฏิเสธนัดบ้าง", "เวลาคนอื่นให้ของขวัญ อย่าแกล้งปฏิเสธ"]}
    },
    "yuzhaizu.json": {
        "en": {"m": "Otaku", "d": "Derived from Japanese 'Otaku'. Refers to people obsessed with hobbies, often staying at home.", "c": "Subculture", "ex": ["Akihabara Otaku Culture", "I am just an otaku"]},
        "ko": {"m": "오타쿠", "d": "일본어 오타쿠에서 유래. 집돌이/집순이와 비슷하게 쓰임.", "c": "서브컬처", "ex": ["아키하바라 오타쿠 문화", "나는 그냥 오타쿠다"]},
        "th": {"m": "โอตาคุ", "d": "มาจากภาษาญี่ปุ่น หมายถึงผู้ที่คลั่งไคล้ในงานอดิเรก (มักจะเก็บตัว)", "c": "วัฒนธรรมย่อย", "ex": ["วัฒนธรรมโอตาคุที่อากิฮาบาระ", "ฉันก็แค่โอตาคุคนหนึ่ง"]}
    },
    "yyds.json": {
        "en": {"m": "GOAT (Greatest of All Time) / God-tier", "d": "Acronym for 'Yong Yuan De Shen' (Eternal God). Extremely good.", "c": "Internet Slang", "ex": ["This new flavor is truly GOAT", "Her live singing is GOAT, very awesome", "The outfit is God-tier, vibes maxed out"]},
        "ko": {"m": "신이다 / 쩐다 / 대박", "d": "'영원한 신(Yong Yuan De Shen)'의 약자. 최고라는 뜻.", "c": "인터넷 은어", "ex": ["이 새로운 맛 진짜 쩐다", "그녀의 라이브는 신이다, 진짜 쩐다", "의상 완전 대박, 분위기 깡패다"]},
        "th": {"m": "เทพซ่า / สุดยอด / ยืนหนึ่ง", "d": "ย่อมาจาก 'Yong Yuan De Shen' แปลว่า เป็นดั่งพระเจ้าตลอดกาล (สุดยอดมาก)", "c": "ศัพท์สแลงเน็ต", "ex": ["รสชาติใหม่นี้คือเดอะเบสต์", "ร้องสดได้เทพมาก สุดยอดจริงๆ", "ชุดคือปังมาก บรรยากาศเต็มสิบ"]}
    },
    "zai.json": {
        "en": {"m": "Reinsurance", "d": "Insurance for insurers to spread risk.", "c": "Finance/Investment", "ex": ["Sign reinsurance contract to spread risk", "Reinsurance covers catastrophe risks", "Cooperate with multiple reinsurance companies"]},
        "ko": {"m": "재보험", "d": "보험 회사가 리스크를 분산하기 위해 드는 보험.", "c": "금융/투자", "ex": ["재보험 계약 체결로 리스크 분산", "재보험은 거대 재해 리스크를 커버한다", "여러 재보험사와 협력하다"]},
        "th": {"m": "การประกันภัยต่อ", "d": "การที่บริษัทประกันภัยกระจายความเสี่ยงไปยังบริษัทอื่น", "c": "การเงิน/การลงทุน", "ex": ["เซ็นสัญญาประกันภัยต่อเพื่อกระจายความเสี่ยง", "การประกันภัยต่อคุ้มครองความเสี่ยงจากภัยพิบัติใหญ่", "ร่วมมือกับบริษัทประกันภัยต่อหลายแห่ง"]}
    },
    "zan.json": {
        "en": {"m": "Dirty Orange / Terracotta", "d": "A dark, reddish-orange color.", "c": "Uncategorized", "ex": ["Dirty orange blush colors are nice", "Crazy want to dye hair dirty orange today", "Earth color, menstrual color (deep red), dirty orange, do they really suit you?"]},
        "ko": {"m": "더티 오렌지 / 테라코타", "d": "붉은빛이 도는 탁한 오렌지색.", "c": "미분류", "ex": ["더티 오렌지 계열 블러셔가 예쁘다", "오늘 머리 더티 오렌지로 염색하고 싶어 미치겠다", "흙색, 검붉은색, 더티 오렌지, 진짜 너한테 어울려?"]},
        "th": {"m": "สีส้มอิฐ / ส้มตุ่น", "d": "สีส้มอมแดงหม่นๆ", "c": "ไม่ระบุหมวดหมู่", "ex": ["บลัชออนโทนส้มอิฐสวยดี", "วันนี้อยากย้อมผมสีส้มอิฐมากๆ", "สีดิน สีแดงก่ำ สีส้มอิฐ มันเข้ากับเธอจริงเหรอ?"]}
    },
    "zao.json": {
        "en": {"m": "8 AM person / Early riser / Student having 8am class", "d": "Refers to university students with 8 AM classes or office workers starting early.", "c": "Education/School", "ex": ["8 AM person, to be honest, sleepy every day", "People with no classes half the semester become 8 AM people in the last weeks", "8 AM person? I have full classes, from 8am to 9pm", "5-minute makeup, suitable for 8 AM people"]},
        "ko": {"m": "아침 8시 등교생 / 출근러", "d": "1교시(8시) 수업을 듣는 대학생이나 일찍 출근하는 직장인.", "c": "교육/학교", "ex": ["8시 수업 듣는 사람, 솔직히 매일 너무 졸리다", "반 학기 동안 수업 없던 사람들이 마지막 몇 주 동안 8시 등교생이 된다", "8시 등교? 난 풀강이다, 아침 8시부터 밤 9시까지", "5분 출근 메이크업, 아침 일찍 나가는 사람에게 딱이다"]},
        "th": {"m": "คนตื่นเช้า (เรียน/งาน 8 โมง)", "d": "หมายถึงนักศึกษาที่มีเรียน 8 โมงเช้า หรือคนทํางานเลาเดียวกัน", "c": "การศึกษา/โรงเรียน", "ex": ["คนเรียน 8 โมงเช้า พูดตรงๆ ง่วงทุกวัน", "คนที่ไม่มีเรียนมาครึ่งเทอม กลายเป็นคนตื่น 8 โมงในสัปดาห์สุดท้าย", "ตื่น 8 โมงเหรอ? ฉันเรียนเต็มวัน ตั้งแต่ 8 โมงเช้าถึง 3 ทุ่ม", "แต่งหน้า 5 นาที เหมาะสำหรับคนตื่นเช้า"]}
    },
    "ze.json": {
        "en": {"m": "Very / Super / Hella", "d": "Dialect word used as an intensifier.", "c": "Dialect", "ex": ["Kids slept hella soundly today", "This zip hoodie is super comfortable", "Brat went into toilet and set off firecrackers, sound was hella loud", "Mindset has become super twisted"]},
        "ko": {"m": "매우 / 겁나 / 엄청", "d": "동북 방언으로 형용사나 부사를 강조함.", "c": "방언", "ex": ["오늘 아이들이 엄청 잘 잔다", "이 후드 집업 겁나 편하다", "말썽꾸러기가 화장실 가서 폭죽 터뜨렸는데 소리 겁나 컸다", "멘탈이 이미 겁나 비뚤어졌다"]},
        "th": {"m": "โคตร / มาก", "d": "ภาษาถิ่นใช้ขยายคำเพื่อบอกระดับว่า 'มาก' หรือ 'สุดๆ'", "c": "ภาษาถิ่น", "ex": ["วันนี้เด็กๆ หลับสนิทมาก", "เสื้อฮู้ดตัวนี้ใส่สบายโคตร", "เด็กเปรตเข้าไปจุดประทัดในห้องน้ำ เสียงดังโคตรๆ", "ทัศนคติเบี้ยวไปหมดแล้ว"]}
    },
    "zenme.json": {
        "en": {"m": "What's going on? / What happened?", "d": "Cute/slang pronunciation of 'Zen Me Hui Shi'.", "c": "Internet Slang", "ex": ["Oh my, don't know what's going on", "Damn, what on earth is going on", "Headache today, what's going on", "No signal on phone, what's happening"]},
        "ko": {"m": "무슨 일이야? / 웬일이야?", "d": "'어떻게 된 일이야(Zen Me Hui Shi)'의 귀여운 발음.", "c": "인터넷 은어", "ex": ["맙소사, 무슨 일인지 모르겠다", "젠장, 도대체 무슨 일이야", "오늘 머리 아프네, 왜 이러지", "폰 신호가 없네, 무슨 일이야"]},
        "th": {"m": "เกิดอะไรขึ้น / เป็นอะไรไป", "d": "เสียงเพี้ยนแบบน่ารักของคําว่า 'เจิ่นเมอหุยซื่อ'", "c": "ศัพท์สแลงเน็ต", "ex": ["ตายจริง ไม่รู้ว่าเกิดอะไรขึ้น", "ให้ตายสิ มันเกิดอะไรขึ้นกันแน่", "วันนี้ปวดหัว เป็นอะไรเนี่ย", "มือถือไม่มีสัญญาณ เกิดอะไรขึ้น"]}
    },
    "zhainan.json": {
        "en": {"m": "Otaku male / Nerd / Homebody", "d": "Males who prefer staying at home, often interested in anime/games.", "c": "Lifestyle", "ex": ["He is a typical otaku male"]},
        "ko": {"m": "오타쿠 남 / 집돌이", "d": "집에 있는 것을 좋아하는 남자.", "c": "라이프스타일", "ex": ["그는 전형적인 오타쿠 남이다"]},
        "th": {"m": "หนุ่มโอตาคุ / หนุ่มติดบ้าน", "d": "ผู้ชายที่ชอบเก็บตัวอยู่บ้าน", "c": "ไลฟ์สไตล์", "ex": ["เขาเป็นหนุ่มโอตาคุตามแบบฉบับ"]}
    },
    "zhalie.json": {
        "en": {"m": "Explosive / Mind-blowing", "d": "Describes something shocking, amazing, or explosive.", "c": "Reviews/Reactions", "ex": ["Stage effect was too explosive"]},
        "ko": {"m": "쩐다 / 대박이다 / 폭발적이다", "d": "퍼포먼스나 효과가 충격적이고 멋짐.", "c": "평가/반응", "ex": ["무대 효과가 너무 쩔었다 (폭발적이었다)"]},
        "th": {"m": "ระเบิดเถิดเทิง / สุดยอด / ปังมาก", "d": "การแสดงหรือผลงานที่สุดยอดจนน่าตกใจ", "c": "การวิจารณ์/ปฏิกิริยา", "ex": ["เอฟเฟกต์เวทีคือระเบิดเถิดเทิงมาก (สุดยอดมาก)"]}
    },
    "zhan.json": {
        "en": {"m": "Scumbag / Jerk / Player", "d": "A terrible man (cheater, irresponsible, etc.).", "c": "Internet Slang", "ex": ["Don't have any illusions about scumbags!", "How can there be such a scumbag, get lost", "What to do if I like scumbags? I meet them in every relationship", "Once you meet a scumbag, must stay away"]},
        "ko": {"m": "쓰레기 같은 남자 / 나쁜 남자 / 똥차", "d": "바람둥이거나 성격이 최악인 남자.", "c": "인터넷 은어", "ex": ["쓰레기 같은 남자에게 환상을 갖지 마라!", "어떻게 이런 쓰레기가 있지, 꺼져라", "나쁜 남자가 좋으면 어쩌지? 연애할 때마다 똥차만 만난다", "쓰레기를 만나면 무조건 멀리해야 한다"]},
        "th": {"m": "ผู้ชายเฮงซวย / ผู้ชายเลว / แมงดา", "d": "ผู้ชายขี้โกหก เจ้าชู้ ไม่มีความรับผิดชอบ", "c": "ศัพท์สแลงเน็ต", "ex": ["อย่าไปเพ้อฝันอะไรกับผู้ชายเฮงซวย!", "มีผู้ชายเลวๆ แบบนี้ได้ไง ไปให้พ้น", "ชอบผู้ชายเลวๆ ทำไงดี? มีแฟนกี่ทีก็เจอแต่คนเฮงซวย", "ถ้าเจอผู้ชายเลวๆ ต้องอยู่ให้ห่าง"]}
    },
    "zhang.json": {
        "en": {"m": "Well-balanced / Paced", "d": "Appropriate balance between tension and relaxation.", "c": "Idioms", "ex": ["He combines hardness and softness, well-balanced", "Story pacing is very good, well-balanced", "Not too busy, not too free, well-balanced", "Only by relaxing and being well-balanced can you handle life's problems"]},
        "ko": {"m": "완급 조절이 있다 / 균형 잡히다", "d": "긴장과 이완이 적절히 조화를 이룸.", "c": "성어/사자성어", "ex": ["그는 강온을 겸비하고 완급 조절이 있다", "스토리 리듬이 아주 좋다, 밀당이 있다", "너무 바쁘지도 너무 한가하지도 않게, 균형 있게", "마음을 편히 먹고 균형을 잡아야 삶의 난제에 대처할 수 있다"]},
        "th": {"m": "มีความสมดุล / ผ่อนหนักผ่อนเบา", "d": "ความตึงและความหย่อนที่พอดี มีจังหวะจะโคน", "c": "สำนวน", "ex": ["เขามีทั้งความแข็งและอ่อน มีความสมดุล", "การดำเนินเรื่องดีมาก มีผ่อนหนักผ่อนเบา", "ไม่ยุ่งไป ไม่ว่างไป ให้มีความสมดุล", "ต้องผ่อนคลายและมีความสมดุลถึงจะรับมือกับปัญหาชีวิตได้"]}
    },
    "zhao.json": {
        "en": {"m": "Copy blindly / Imitate exactly", "d": "To copy something exactly as it is (sometimes implies lack of creativity).", "c": "Uncategorized", "ex": ["Fastest way to excel is to imitate, copy blindly", "Remember this match, copying it blindly gives a British style", "My work can be a reference template, but don't copy blindly"]},
        "ko": {"m": "그대로 베끼다 / 답습하다", "d": "남의 것을 그대로 따르거나 모방함.", "c": "미분류", "ex": ["우수해지는 가장 빠르고 쉬운 방법은 모방, 그대로 베끼는 것이다", "이 코디를 기억해라, 그대로 입으면 영국 스타일이다", "내 작품은 참고할 수 있지만 그대로 베끼지는 마라"]},
        "th": {"m": "ลอกมาทั้งดุ้น / เลียนแบบเป๊ะๆ", "d": "คัดลอกหรือเลียนแบบมาโดยไม่ดัดแปลง", "c": "ไม่ระบุหมวดหมู่", "ex": ["วิธีที่จะเก่งเร็วที่สุดคือการเลียนแบบ ลอกมาทั้งดุ้น", "จำสไตล์นี้ไว้ แต่งตามนี้ก็ได้ลุคผู้ดีอังกฤษแล้ว", "งานของฉันใช้เป็นแบบอ้างอิงได้ แต่อย่าลอกไปทั้งดุ้น"]}
    },
    "zhe.json": {
        "en": {"m": "At this age", "d": "Used to express surprise at someone doing something inappropriate for their age.", "c": "Uncategorized", "ex": ["Staying up late at this age", "Grandpa looking for a job at this age", "Wearing a floral mini skirt at this age"]},
        "ko": {"m": "이 나이에 / 나이 먹고", "d": "나이에 맞지 않는 행동을 할 때 씀.", "c": "미분류", "ex": ["이 나이에 밤을 새우다니", "할아버지가 이 연세에 구직을 하시다니", "이 나이에 꽃무늬 미니스커트를 입다니"]},
        "th": {"m": "อายุปูนนี้แล้ว / แก่ขนาดนี้แล้ว", "d": "ใช้วิจารณ์พฤติกรรมที่ไม่สมวัย", "c": "ไม่ระบุหมวดหมู่", "ex": ["อายุปูนนี้แล้วยังจะอดหลับอดนอน", "ปู่หาเงินอายุปูนนี้แล้ว", "อายุปูนนี้แล้วยังใส่กระโปรงสั้นลายดอก"]}
    },
    "zhen.json": {
        "en": {"m": "Spouse / Partner / Bed partner", "d": "Refers to one's husband or wife.", "c": "Love/Marriage", "ex": ["What is most important in life? The so-called partner, do you really know them?", "Realized when old, second half of life relies not on children but on the partner", "Partner can't become the beloved, beloved can't become the partner"]},
        "ko": {"m": "배우자 / 동반자", "d": "남편이나 아내를 의미.", "c": "연애/결혼", "ex": ["인생에서 가장 중요한 건 뭔가? 이른바 배갯머리 파트너, 진짜 이해하나?", "늙어서야 깨달았다, 인생 후반전은 자식이 아니라 배우자다", "배우자가 연인이 될 수 없고, 연인이 배우자가 될 수 없다"]},
        "th": {"m": "คู่ชีวิต / คนข้างหมอน", "d": "สามีหรือภรรยา", "c": "ความรัก/การแต่งงาน", "ex": ["อะไรสำคัญที่สุดในชีวิต? คนข้างหมอนที่คุณเรียก รู้จักเขาดีพอหรือยัง?", "แก่ตัวลงถึงรู้ว่า ครึ่งหลังของชีวิตไม่ได้พึ่งลูกหลาน แต่พึ่งคนข้างหมอน", "คนข้างหมอนไม่ได้เป็นคนรัก คนรักไม่ได้เป็นคนข้างหมอน"]}
    },
    "zhende.json": {
        "en": {"m": "Real is real, fake is fake", "d": "The real thing cannot be fake, and the fake thing cannot be real.", "c": "Idioms", "ex": ["Fake can never be real, imitation is imitation; real serves real, fake serves fake", "You look for true love. True is true, fake is fake", "Truth is always truth, lies may deceive for a while but not forever. Real is real"]},
        "ko": {"m": "진짜는 가짜가 될 수 없고 가짜는 진짜가 될 수 없다", "d": "진품과 가품은 본질적으로 다르다는 뜻.", "c": "성어/사자성어", "ex": ["가짜는 영원히 진짜가 될 수 없고 모방은 모방일 뿐이다. 진짜는 진짜고 가짜는 가짜다", "당신은 진정한 사랑을 찾고 있다. 진짜는 진짜고 가짜는 가짜다", "진리는 영원히 진리다. 거짓말은 잠시 속일 수 있어도 영원히 속일 순 없다"]},
        "th": {"m": "ของจริงก็คือของจริง ของปลอมก็คือของปลอม", "d": "ของแท้กับของเทียมยังไงก็ต่างกัน", "c": "สำนวน", "ex": ["ของปลอมไม่มีวันเป็นของจริง การเลียนแบบก็คือการเลียนแบบ ของจริงก็คือของจริง ของปลอมก็คือของปลอม", "คุณตามหารักแท้ ของจริงย่อมเป็นของจริง ของปลอมย่อมเป็นของปลอม", "ความจริงยังไงก็คือความจริง คำโกหกอาจหลอกได้ชั่วคราวแต่หลอกไปตลอดไม่ได้"]}
    },
    "zheng.json": {
        "en": {"m": "Stubborn / Intractable / Tough", "d": "Literally 'cannot be steamed or boiled soft'. Describes someone stubborn or hard to manage.", "c": "Idioms", "ex": ["I am that uncookable piece of meat (tough/stubborn)", "Thick skinned, truly unmanageable", "Hope this unmanageable life ends here completely"]},
        "ko": {"m": "구제불능 / 다루기 힘들다 / 고집불통", "d": "삶아도 쪄도 안 익는다. 처치 곤란하고 비협조적인 사람.", "c": "성어/사자성어", "ex": ["나는 삶아도 구워도 안 익는 놈이다 (고집불통)", "낯짝 두껍네, 진짜 구제불능이다", "이런 구제불능의 삶이 여기서 완전히 끝나길 바란다"]},
        "th": {"m": "ดื้อด้าน / สอนไม่จำ / เกินเยียวยา", "d": "เปรียบเปรยถึงคนที่จัดการยาก ดื้อรั้นมาก", "c": "สำนวน", "ex": ["ฉันมันพวกหัวแข็ง สั่งสอนไม่จำ", "หน้าหนาจริงๆ เกินเยียวยาแล้ว", "หวังว่าชีวิตอันเฮงซวยนี้จะจบสิ้นลงตรงนี้เสียที"]}
    },
    "zhenghuo.json": {
        "en": {"m": "Doing a stunt / Creating content", "d": "Content creators doing something interesting or funny to gain views.", "c": "Content/Planning", "ex": ["Uploader did a stunt today"]},
        "ko": {"m": "재밌는 짓을 하다 / 컨텐츠를 만들다 / 쑈를 하다", "d": "스트리머나 유튜버가 분위기를 띄우기 위해 기획을 함.", "c": "컨텐츠/기획", "ex": ["오늘 유튜버가 재밌는 기획을 했다"]},
        "th": {"m": "ทำคอนเทนต์ / เล่นมุก / หาทำ", "d": "การจัดฉากหรือทําอะไรตลกๆ เพื่อเรียกยอดไลก์", "c": "คอนเทนต์/การวางแผน", "ex": ["วันนี้ครีเอเตอร์ทำคอนเทนต์ฮาๆ"]}
    },
    "zhenxiang.json": {
        "en": {"m": "True Fragrance (Hypocritical/So good)", "d": "Slang describing someone who refuses something at first but then loves it. Also simply means 'very good/delicious'.", "c": "Uncategorized", "ex": ["BBQ on the beach is truly delicious", "Can smell coffee, smells so good", "Drama I didn't want to watch at first, but loved it on second look"]},
        "ko": {"m": "찐향기 / 결국 좋아하게 됨", "d": "처음엔 거부하다가 나중엔 좋아하게 되는 반전 매력. 또는 그냥 정말 좋다는 뜻.", "c": "미분류", "ex": ["해변 바비큐는 진짜 꿀맛이다", "커피 향이 난다, 진짜 향기롭다", "처음엔 안 보려 했는데 다시 보니 빠져든 드라마다"]},
        "th": {"m": "หอมจริง (กลับคำ/กลืนน้ำลายตัวเอง) / ดีงาม", "d": "อาการที่ตอนแรกปฏิเสธแต่สุดท้ายก็ชอบ (กลืนน้ําลายตัวเอง) หรือหมายถึงดีมากๆ ก็ได้", "c": "ไม่ระบุหมวดหมู่", "ex": ["บาร์บีคิวริมหาดคือดีงามจริงๆ", "ได้กลิ่นกาแฟ หอมจริงๆ", "ละครที่ตอนแรกไม่อยากดู แต่พอดูแล้วติดงอมแงม (กลืนน้ำลายตัวเอง)"]}
    },
    "zhi.json": {
        "en": {"m": "Straightforward / Blunt", "d": "Speaking directly without hiding anything.", "c": "Uncategorized", "ex": ["The other party speaks very straightforwardly", "Can't refuse bluntly, how should I refuse?", "Too straightforward, how do you express love?", "Try not to speak bluntly about children's faults", "Don't understand why things can't be said straightforwardly"]},
        "ko": {"m": "직설적이다 / 솔직하다", "d": "돌려 말하지 않고 직접적으로 말함.", "c": "미분류", "ex": ["상대방의 화법이 매우 직설적이다", "직설적으로 거절할 수 없는데, 어떻게 거절하지?", "너무 직설적이다, 사랑 표현을 어떻게 그렇게 하니?", "아이의 단점을 직설적으로 말하지 않도록 해라", "왜 뭐든 직설적으로 말하면 안 되는지 이해가 안 간다"]},
        "th": {"m": "ตรงไปตรงมา / ขวานผ่าซาก", "d": "พูดตรงๆ ไม่มีการอ้อมค้อม", "c": "ไม่ระบุหมวดหมู่", "ex": ["อีกฝ่ายพูดจาตรงไปตรงมามาก", "ปฏิเสธตรงๆ ไม่ได้ ควรปฏิเสธยังไงดี?", "ตรงเกินไปแล้ว คุณแสดงความรักแบบนั้นได้ไง?", "พยายามอย่าพูดถึงข้อเสียของเด็กตรงๆ", "ไม่เข้าใจว่าทำไมเรื่องต่างๆ ถึงพูดตรงๆ ไม่ได้"]}
    },
    "zhibo.json": {
        "en": {"m": "Livestream shopping / Live Commerce", "d": "Introduction and sale of products via live streaming.", "c": "Web/SNS Terms", "ex": ["Livestream selling has become a new trend in China's e-commerce", "Famous influencer sold 1 million in clothes via livestream"]},
        "ko": {"m": "라이브 커머스 / 라방", "d": "라이브 방송을 통해 물건을 판매하는 것.", "c": "웹/SNS 용어", "ex": ["라이브 커머스는 이미 중국 전자상거래의 새로운 붐이다", "유명 인플루언서가 라이브 커머스로 한 달에 100만 위안어치 옷을 팔았다"]},
        "th": {"m": "ไลฟ์ขายของ / ไลฟ์คอมเมิร์ซ", "d": "การถ่ายทอดสดเพื่อขายสินค้าออนไลน์", "c": "ศัพท์เว็บ/โซเชียล", "ex": ["ไลฟ์ขายของกลายเป็นเทรนด์ใหม่ในวงการอีคอมเมิร์ซจีนแล้ว", "อินฟลูฯ ดังไลฟ์ขายเสื้อผ้าเดือนเดียวขายได้ 1 ล้าน"]}
    },
    "zhichi.json": {
        "en": {"m": "Knowing shame leads to courage", "d": "Acknowledging one's shortcomings is the first step to courage and improvement.", "c": "Idioms", "ex": ["Must understand that knowing shame leads to courage; correcting mistakes is a great virtue", "Students with bad grades should know shame and be courageous", "Knowing shame led to courage, finally won the first World Cup victory"]},
        "ko": {"m": "부끄러움을 아는 것이 용기에 가깝다 (지치후용)", "d": "자신의 부족함을 알고 고쳐나가는 것이 진정한 용기다.", "c": "성어/사자성어", "ex": ["부끄러움을 아는 것이 용기임을 알아야 한다. 잘못을 고치는 것이 가장 큰 선이다", "성적이 나쁜 학생은 부끄러움을 알고 분발해야 한다", "절치부심하여 드디어 월드컵 첫 승을 거두었다"]},
        "th": {"m": "รู้ละอายจึงกล้าหาญ", "d": "การรู้จุดด้อยของตนแล้วปรับปรุงคือความกล้าหาญ", "c": "สำนวน", "ex": ["ต้องรู้จักว่าความละอายนำมาซึ่งความกล้าหาญ ผิดแล้วแก้ตัวเป็นเรื่องประเสริฐ", "นักเรียนที่เกรดไม่ดีควรรู้จักละอายแล้วฮึดสู้", "รู้ละอายจึงฮึดสู้ จนคว้าชัยชนะนัดแรกในบอลโลกได้สำเร็จ"]}
    },
    "zhiquansaorao.json": {
        "en": {"m": "Power harassment", "d": "Harassment by someone in a position of power (boss, superior).", "c": "Internet Slang", "ex": ["Have you encountered power harassment?", "Leader abusing power must be punished severely", "I suffered severe power harassment at the company"]},
        "ko": {"m": "갑질 / 직장 내 괴롭힘 / 권력형 성희롱", "d": "직위나 권한을 남용하여 괴롭히는 행위.", "c": "인터넷 은어", "ex": ["갑질(직권 남용 괴롭힘)을 당한 적 있나요?", "상사의 직권 남용 괴롭힘은 엄벌해야 한다", "나는 회사에서 심각한 갑질을 당했다"]},
        "th": {"m": "การใช้อำนาจคุกคาม / บ้าอำนาจ", "d": "การใช้อำนาจหน้าที่รังแกหรือคุกคามผู้อื่น (Power Harassment)", "c": "ศัพท์สแลงเน็ต", "ex": ["คุณเคยเจอการใช้อำนาจคุกคามไหม?", "หัวหน้าใช้อำนาจคุกคามต้องถูกลงโทษอย่างหนัก", "ฉันโดนใช้อำนาจคุกคามอย่างหนักในบริษัท"]}
    },
    "zhong.json": {
        "en": {"m": "Heavyweight / Major / Blockbuster", "d": "Extremely important or influential news.", "c": "Uncategorized", "ex": ["Market has major positive news", "CCTV speaks out heavily!", "Ministry of Education released blockbuster news today!", "'New Energy' is one of the most heavyweight keywords in the auto market", "Heavyweight Title: Taiwan issue shows danger signals", "Blockbuster! Fed to start cutting rates early"]},
        "ko": {"m": "중대 / 대형 / 빅뉴스", "d": "매우 중요하고 영향력 있는 뉴스나 정보.", "c": "미분류", "ex": ["시장에 대형 호재가 있다", "CCTV가 중대 발표를 했다!", "오늘 교육부가 중대 뉴스를 발표했다!", "'신에너지'는 자동차 시장의 가장 핫한 키워드 중 하나다", "충격 헤드라인: 대만 문제 위험 신호", "대박 뉴스! 연준이 조기 금리 인하를 시작한다"]},
        "th": {"m": "ข่าวใหญ่ / เรื่องสำคัญ / ระดับบิ๊ก", "d": "ข่าวหรือข้อมูลที่มีความสำคัญและมีอิทธิพลมาก", "c": "ไม่ระบุหมวดหมู่", "ex": ["ตลาดมีข่าวดีเรื่องใหญ่", "CCTV แถลงการณ์ครั้งสำคัญ!", "วันนี้กระทรวงศึกษาธิการประกาศข่าวใหญ่!", "'พลังงานใหม่' เป็นหนึ่งในคำค้นที่มาแรงที่สุดในตลาดรถยนต์", "พาดหัวข่าวใหญ่: ปัญหาไต้หวันส่อสัญญาณอันตราย", "ข่าวใหญ่! เฟดจะเริ่มลดดอกเบี้ยเร็วกว่ากำหนด"]}
    },
    "zhongcao.json": {
        "en": {"m": "Planting grass (To entice/recommend)", "d": "Slang for recommending a product so much that others want to buy it.", "c": "Internet Slang", "ex": ["I was enticed by this lipstick"]},
        "ko": {"m": "뽐뿌질 / 영업하다", "d": "다른 사람의 추천으로 구매 욕구가 생김.", "c": "인터넷 은어", "ex": ["이 립스틱 영업 당했다 (사고 싶어졌다)"]},
        "th": {"m": "ป้ายยา", "d": "ทำให้คนอื่นอยากซื้อสินค้าตามคำแนะนำ", "c": "ศัพท์สแลงเน็ต", "ex": ["ฉันโดนป้ายยาลิปสติกแท่งนี้เข้าแล้ว"]}
    },
    "zhongchou.json": {
        "en": {"m": "Crowdfunding", "d": "Raising small amounts of money from a large number of people via the internet.", "c": "Finance/Investment", "ex": ["Launch crowdfunding to support new product", "Crowdfunding goal reached", "Participate in crowdfunding to get returns"]},
        "ko": {"m": "크라우드 펀딩", "d": "인터넷을 통해 다수의 개인으로부터 자금을 모으는 방식.", "c": "금융/투자", "ex": ["신제품 지원을 위해 크라우드 펀딩 시작", "펀딩 목표 달성", "펀딩 참여하고 리워드 받기"]},
        "th": {"m": "การระดมทุนมวลชน (Crowdfunding)", "d": "การระดมทุนจากคนจำนวนมากผ่านอินเทอร์เน็ต", "c": "การเงิน/การลงทุน", "ex": ["เปิดระดมทุน Crowdfunding สนับสนุนสินค้าใหม่", "บรรลุเป้าหมายระดมทุนแล้ว", "เข้าร่วมระดมทุนเพื่อรับผลตอบแทน"]}
    },
    "zhou.json": {
        "en": {"m": "True capability shows in crisis", "d": "Literally: 'Only when the boat capsizes do you see the good swimmer.'", "c": "Idioms", "ex": ["...what kind of life you have depends entirely on your own strength", "Ordinarily differences are hidden, but crisis reveals talent"]},
        "ko": {"m": "배가 뒤집혀야 수영 실력을 볼 수 있다 (위기가 닥쳐야 진가를 안다)", "d": "평상시에는 알 수 없던 능력이 위기 상황에서 드러남.", "c": "성어/사자성어", "ex": ["(위기 상황이 닥쳐야 진가를 안다) 어떤 인생을 살지는 전적으로 자신의 실력에 달렸다", "평소에는 잠재적 차이가 드러나지 않지만 위기가 닥쳐야 진가를 알 수 있다"]},
        "th": {"m": "สถานการณ์สร้างวีรบุรุษ", "d": "แปลตรงตัว: เรือล่มถึงเห็นคนว่ายน้ำเก่ง (ความสามารถที่แท้จริงจะปรากฏในยามวิกฤต)", "c": "สำนวน", "ex": ["(สถานการณ์สร้างวีรบุรุษ) จะมีชีวิตแบบไหนขึ้นอยู่กับความสามารถของตัวเองล้วนๆ", "เวลาปกติมองไม่เห็นความแตกต่าง สถานการณ์วิกฤตถึงจะพิสูจน์คนได้"]}
    },
    "zhu.json": {
        "en": {"m": "Arrogant / Cocky / Acting high and mighty", "d": "Behaving arrogantly.", "c": "Internet Slang", "ex": ["Since you became a teacher, don't act so high and mighty", "She is usually nice, but acts high and mighty when driving", "HQ person acts high and mighty asking for things, turns out she's the Chairman's niece"]},
        "ko": {"m": "거만하다 / 뻐기다 / 가오 잡다", "d": "오만하고 거들먹거리는 태도.", "c": "인터넷 은어", "ex": ["선생님 됐다고 그렇게 거들먹거리지 마라", "그녀는 평소엔 좋은 사람인데 운전만 하면 난폭해진다", "본사 직원 뭘 요청할 때마다 겁나 뻐기더니 알고 보니 회장 조카였다"]},
        "th": {"m": "วางก้าม / ทำตัวกร่าง / ขี้เก๊ก", "d": "ทำตัวยิ่งใหญ่ หยิ่งยโส", "c": "ศัพท์สแลงเน็ต", "ex": ["เป็นครูแล้วก็อย่าทำตัวกร่างนักเลย", "ปกติเธอนิสัยดี แต่พอขับรถแล้วทำตัวกร่างมาก", "คนจากสำนักงานใหญ่ขอของทีไรทำตัวใหญ่โต ที่แท้ก็หลานประธาน"]}
    },
    "zhuangb.json": {
        "en": {"m": "Flex / Act cool / Posturing", "d": "Pretending to be impressive or cool.", "c": "Internet Terms", "ex": ["Hate people who flex the most", "Benz bought just to flex", "Boss flexed saying this problem is too simple"]},
        "ko": {"m": "폼 잡다 / 허세 부리다 / 잘난 척하다", "d": "자신을 과시하거나 멋있는 척함.", "c": "인터넷 용어", "ex": ["허세 부리는 사람이 제일 싫다", "폼 잡으려고 산 벤츠", "사장이 이 문제는 너무 쉽다며 잘난 척했다"]},
        "th": {"m": "ขี้เก๊ก / โชว์พาว / อวดเก่ง", "d": "แกล้งทำเก่งหรือทำเท่", "c": "ศัพท์เน็ต", "ex": ["เกลียดพวกขี้เก๊กที่สุด", "รถเบนซ์ที่ซื้อมาเพื่ออวดสาว", "บอสโชว์พาวบอกว่าปัญหานี้ง่ายจะตาย"]}
    },
    "zhui.json": {
        "en": {"m": "The best / Coolest", "d": "Slang for 'Most Awesome'.", "c": "Internet Slang", "ex": ["Parents' love is still the coolest/best", "Weather forecast is the coolest, really rained in the afternoon", "I helped everyone, I am the coolest"]},
        "ko": {"m": "최고다 / 쩐다", "d": "가장 대단하다(Zui Diao)의 발음 변형.", "c": "인터넷 은어", "ex": ["역시 부모님 사랑이 최고다", "일기예보 진짜 쩐다, 오후에 진짜 비 왔다", "난 모두를 도왔다, 난 최고다"]},
        "th": {"m": "สุดยอด / เจ๋งที่สุด / เดอะเบสต์", "d": "เจ๋งที่สุด (เพี้ยนเสียงมาจาก จุ้ยเตี่ยว)", "c": "ศัพท์สแลงเน็ต", "ex": ["ความรักของพ่อแม่คือที่สุดแล้ว", "พยากรณ์อากาศแม่นเวอร์ บ่ายฝนตกจริงด้วย", "ฉันช่วยทุกคน ฉันนี่มันเจ๋งจริงๆ"]}
    },
    "zhun.json": {
        "en": {"m": "Are you crazy? / Prepare for drug test", "d": "Sarcastic remark implying someone is acting crazy (like on drugs).", "c": "Internet Slang", "ex": ["Brain short-circuit? Prepare for drug test (Go seek help)", "This person really needs a drug test (is crazy)", "Doubt your mental state, prepare for drug test"]},
        "ko": {"m": "약 검사 준비해라 (미쳤냐?)", "d": "상대가 제정신이 아닐 때 비꼬는 말.", "c": "인터넷 은어", "ex": ["뇌가 멈췄냐? 약 검사 좀 받아봐라", "이 사람 진짜 제정신 아닌 듯", "너희 정신 상태가 의심스럽다, 약 검사 해봐"]},
        "th": {"m": "ไปตรวจฉี่ม่วงไหม / บ้าหรือเปล่า", "d": "ใช้ประชดคนที่ทำตัวบ้าๆ บอๆ เหมือนคนเมายา", "c": "ศัพท์สแลงเน็ต", "ex": ["สมองรวนเหรอ? ไปตรวจฉี่หน่อยไหม", "คนนี้บ้าไปแล้วมั้ง", "สงสัยสภาพจิตพวกนายจริงๆ ไปตรวจหน่อยไป"]}
    },
    "zi.json": {
        "en": {"m": "Unique style / In a class of its own", "d": "Having a unique and distinct style.", "c": "Idioms", "ex": ["Famous paintings have extraordinary aura, unique style", "Her outfit has a unique style, really beautiful", "Villa design blueprint, unique living space"]},
        "ko": {"m": "독자적인 스타일 / 일가견 / 독창적이다", "d": "자신만의 독특한 격식이나 품위가 있다.", "c": "성어/사자성어", "ex": ["명인의 서화는 비범한 아우라가 있고 독자적인 격식이 있다", "그녀의 코디는 독창적이고 정말 예쁘다", "별장 설계도, 독자적인 주거 공간"]},
        "th": {"m": "มีเอกลักษณ์เฉพาะตัว / มีสไตล์เป็นของตัวเอง", "d": "มีรูปแบบหรือสไตล์ที่ไม่เหมือนใคร", "c": "สำนวน", "ex": ["ภาพวาดคนดังมีออร่าไม่ธรรมดา มีเอกลักษณ์เฉพาะตัว", "การแต่งตัวของเธอมีสไตล์มาก สวยจริงๆ", "แบบแปลนวิลล่า พื้นที่อยู่อาศัยที่มีเอกลักษณ์"]}
    },
    "zou.json": {
        "en": {"m": "Beat up / Flatten", "d": "To hit or beat someone up.", "c": "Insult/Provocation", "ex": ["Damn, I'm coming to beat you up", "Say it again and I'll beat you up!", "Want to beat up people smoking in elevator"]},
        "ko": {"m": "패다 / 두들겨 패다 / 박살내다", "d": "때려눕히다.", "c": "시비/욕설", "ex": ["젠장, 널 패주러 가겠다", "한 번만 더 말하면 패버린다!", "엘리베이터에서 담배 피우는 사람 패주고 싶다"]},
        "th": {"m": "อัดให้น่วม / ซ้อม / ต่อย", "d": "ทุบตีหรือทำร้ายร่างกาย", "c": "คำด่า/คำยั่วยุ", "ex": ["เชี่ย เดี๋ยวปั๊ดเหนี่ยวเลย", "พูดอีกทีเดี๋ยวโดนดีแน่!", "อยากซัดหน้าพวกสูบบุหรี่ในลิฟต์"]}
    },
    "zqsg.json": {
        "en": {"m": "True feelings / Genuine emotion", "d": "Recommending or supporting something with sincere feelings.", "c": "Internet Slang", "ex": ["I sincerely recommend this drama with true feelings"]},
        "ko": {"m": "진심 / 찐감정", "d": "진심 어린 감정.", "c": "인터넷 은어", "ex": ["나 이 드라마 진심으로 영업한다"]},
        "th": {"m": "ความรู้สึกจริงๆ / อิน / จากใจจริง", "d": "ความรู้สึกที่แท้จริง (ใช้ในการอวยเมนหรือสิ่งที่ชอบ)", "c": "ศัพท์สแลงเน็ต", "ex": ["ฉันแนะนำละครเรื่องนี้จากใจจริง"]}
    },
    "zu.json": {
        "en": {"m": "Diamond Man / Perfect Man", "d": "A man who is perfect in terms of wealth, status, and looks.", "c": "Internet Slang", "ex": ["He is a diamond man", "What kind of women do diamond men want most?", "Drives BMW, bought house near company, truly a high quality diamond man"]},
        "ko": {"m": "다이아몬드 남 / 완벽남", "d": "재력, 능력, 외모를 갖춘 완벽한 남자.", "c": "인터넷 은어", "ex": ["그는 다이아몬드 남(완벽남)이다", "다이아몬드 남이 가장 원하는 여자는?", "BMW 몰고 회사 근처에 집 샀다, 진짜 우량 다이아몬드 남이다"]},
        "th": {"m": "ผู้ชายเพอร์เฟกต์ / ผู้ชายเกรดพรีเมียม", "d": "ผู้ชายที่มีครบทั้งฐานะ หน้าตา และความสามารถ", "c": "ศัพท์สแลงเน็ต", "ex": ["เขาเป็นผู้ชายเกรดพรีเมียม", "ผู้หญิงแบบไหนที่หนุ่มเพอร์เฟกต์ต้องการ?", "ขับ BMW ซื้อบ้านใกล้บริษัท เป็นผู้ชายเกรดพรีเมียมของจริง"]}
    },
    "zuo.json": {
        "en": {"m": "Coordinate / Location", "d": "Refers to location or place in SNS context.", "c": "Web/SNS Terms", "ex": ["Where to buy extra large shoes in Shanghai? Asking for coordinates", "I am at Qingdao, asking for city recommendations nearby", "Leave your coordinates in comments, find a local buddy"]},
        "ko": {"m": "좌표 / 위치", "d": "SNS에서 위치나 장소를 의미.", "c": "웹/SNS 용어", "ex": ["상하이 어디서 특대 사이즈 신발 사나요? 좌표 좀 주세요", "본인 좌표 칭다오, 근처 도시 추천 바람", "댓글에 좌표 남겨서 동네 친구 찾기"]},
        "th": {"m": "พิกัด / ตำแหน่ง", "d": "หมายถึงสถานที่หรือโลเคชั่นในภาษาโซเชียล", "c": "ศัพท์เว็บ/โซเชียล", "ex": ["เซี่ยงไฮ้ซื้อรองเท้าไซส์ใหญ่พิเศษได้ที่ไหน? ขอพิกัดหน่อย", "พิกัดชิงเต่า ขอคำแนะนำที่เที่ยวเมืองใกล้ๆ", "ทิ้งพิกัดไว้ในคอมเมนต์ หาเพื่อนแถวบ้าน"]}
    }
}

for filename in files:
    src_path = os.path.join("data/ja", filename)
    
    if not os.path.exists(src_path):
        print(f"Skipping missing file: {src_path}")
        continue
        
    with open(src_path, "r", encoding="utf-8") as f:
        src_data = json.load(f)
    
    trans_data = translations.get(filename)
    if not trans_data:
        print(f"No translation data for: {filename}")
        continue
        
    for lang in ["en", "ko", "th"]:
        target_dir = os.path.join("data", lang)
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
            
        lang_trans = trans_data[lang]
        
        new_data = src_data.copy()
        new_data["meaning"] = lang_trans["m"]
        new_data["description"] = lang_trans["d"]
        new_data["categoryName"] = lang_trans["c"]
        
        new_examples = []
        if "examples" in src_data:
            for i, ex in enumerate(src_data["examples"]):
                new_ex = {"chinese": ex["chinese"]}
                if i < len(lang_trans["ex"]):
                    new_ex["translation"] = lang_trans["ex"][i]
                else:
                     new_ex["translation"] = "" # Fallback
                new_examples.append(new_ex)
        
        new_data["examples"] = new_examples
        
        # Remove old keys if any (japanese)
        if "japanese" in new_data:
            del new_data["japanese"]
            
        out_path = os.path.join(target_dir, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(new_data, f, indent=2, ensure_ascii=False)
            f.write('\n') # Add newline at end of file

print("Processed all files.")
