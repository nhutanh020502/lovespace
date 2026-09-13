import { VocabWord } from '../../../types/vocab.types';

export interface PresetVocabPack {
  id: string;
  title: string;
  topic: string;
  emoji: string;
  description: string;
  gradient: string;
  words: Omit<VocabWord, 'id' | 'createdAt'>[];
}

export const PRESET_VOCAB_PACKS: PresetVocabPack[] = [
  {
    id: 'pack_love',
    title: 'Tình Yêu & Ngọt Ngào',
    topic: 'Tình Yêu Lãng Mạn',
    emoji: '💖',
    description: '10 từ ngọt lịm để hai đứa thủ thỉ và nhắn tin cho nhau mỗi ngày',
    gradient: 'from-rose-500 to-pink-500',
    words: [
      {
        word: 'cherish',
        phonetic: '/ˈtʃer.ɪʃ/',
        partOfSpeech: 'verb',
        meaning: 'yêu thương, trân trọng từng khoảnh khắc',
        example: 'I cherish every second I spend with you.',
        exampleMeaning: 'Anh trân trọng từng giây phút được ở bên em.',
        memoryTip: 'Liên tưởng từ "che chở" - yêu thương và che chở cho nhau.'
      },
      {
        word: 'serendipity',
        phonetic: '/ˌser.ənˈdɪp.ə.ti/',
        partOfSpeech: 'noun',
        meaning: 'sự tình cờ may mắn kỳ diệu',
        example: 'Meeting you was pure serendipity in my life.',
        exampleMeaning: 'Gặp được em chính là điều kỳ diệu may mắn nhất đời anh.',
        memoryTip: 'Từ vựng đẹp nhất tiếng Anh miêu tả định mệnh bất ngờ.'
      },
      {
        word: 'adore',
        phonetic: '/əˈdɔːr/',
        partOfSpeech: 'verb',
        meaning: 'yêu thương tha thiết, mê đắm',
        example: 'I simply adore the cute way you smile.',
        exampleMeaning: 'Anh mê mẩn nụ cười đáng yêu của em.',
        memoryTip: 'Mức độ yêu mãnh liệt và ngắm nhìn say đắm hơn cả "love".'
      },
      {
        word: 'affection',
        phonetic: '/əˈfek.ʃən/',
        partOfSpeech: 'noun',
        meaning: 'tình cảm âu yếm, trìu mến',
        example: 'He showed his affection with a gentle hug.',
        exampleMeaning: 'Anh ấy thể hiện sự âu yếm bằng một cái ôm nhẹ nhàng.',
        memoryTip: 'Gốc từ affect (chạm đến cảm xúc) -> tình cảm trìu mến.'
      },
      {
        word: 'cuddle',
        phonetic: '/ˈkʌd.əl/',
        partOfSpeech: 'verb',
        meaning: 'ôm ấp, cuộn tròn vào lòng nhau ấm áp',
        example: 'Let’s cuddle together and watch our favorite movie.',
        exampleMeaning: 'Mình cùng ôm nhau xem bộ phim yêu thích nhé.',
        memoryTip: 'Âm thanh nghe êm ái như gối ôm mềm mại.'
      },
      {
        word: 'soulmate',
        phonetic: '/ˈsoʊl.meɪt/',
        partOfSpeech: 'noun',
        meaning: 'tri kỷ, bạn tâm giao suốt đời',
        example: 'You are not just my lover, you are my true soulmate.',
        exampleMeaning: 'Em không chỉ là người yêu, mà là tri kỷ đích thực của anh.',
        memoryTip: 'Soul (tâm hồn) + Mate (bạn đời) = Hai tâm hồn đồng điệu.'
      },
      {
        word: 'sweetheart',
        phonetic: '/ˈswiːt.hɑːrt/',
        partOfSpeech: 'noun',
        meaning: 'người yêu dấu, cục cưng ngọt ngào',
        example: 'Good night, my sweetest sweetheart!',
        exampleMeaning: 'Chúc cục cưng ngọt ngào của anh ngủ ngon!',
        memoryTip: 'Sweet (ngọt ngào) + Heart (trái tim).'
      },
      {
        word: 'devotion',
        phonetic: '/dɪˈvoʊ.ʃən/',
        partOfSpeech: 'noun',
        meaning: 'sự hết lòng tận tụy, lòng chung thủy',
        example: 'His devotion to their family never wavered.',
        exampleMeaning: 'Sự tận tụy của anh dành cho gia đình chưa bao giờ lay chuyển.',
        memoryTip: 'Từ chỉ sự thủy chung, toàn tâm toàn ý chăm sóc đối phương.'
      },
      {
        word: 'irresistible',
        phonetic: '/ˌɪr.ɪˈzɪs.tə.bəl/',
        partOfSpeech: 'adjective',
        meaning: 'quyến rũ khó cưỡng, không thể chối từ',
        example: 'Your sparkling eyes are completely irresistible to me.',
        exampleMeaning: 'Đôi mắt long lanh của em làm anh không thể nào cưỡng lại.',
        memoryTip: 'Resist (kháng cự) + ir- (không thể) -> Quá thu hút.'
      },
      {
        word: 'harmonious',
        phonetic: '/hɑːrˈmoʊ.ni.əs/',
        partOfSpeech: 'adjective',
        meaning: 'hòa thuận, êm ấm, ăn ý',
        example: 'We have built a harmonious and peaceful relationship.',
        exampleMeaning: 'Chúng mình đã cùng nhau xây dựng một tình yêu êm ấm và hòa hợp.',
        memoryTip: 'Như một bản hòa âm (harmony) du dương không cãi vã.'
      }
    ]
  },
  {
    id: 'pack_dating',
    title: 'Hẹn Hò & Ăn Uống Quán Ngon',
    topic: 'Ẩm Thực & Đi Chơi',
    emoji: '🍜',
    description: 'Từ vựng xịn xò để bàn xem hôm nay ăn gì, đi đâu chill cùng nhau',
    gradient: 'from-amber-500 to-orange-500',
    words: [
      {
        word: 'scrumptious',
        phonetic: '/ˈskrʌmp.ʃəs/',
        partOfSpeech: 'adjective',
        meaning: 'cực kỳ ngon miệng, tuyệt hảo',
        example: 'This bowl of beef noodle soup is absolutely scrumptious!',
        exampleMeaning: 'Tô phở bò này ngon đỉnh chóp luôn á!',
        memoryTip: 'Từ miêu tả món ăn ngon tới mức muốn ăn sạch bách.'
      },
      {
        word: 'cozy',
        phonetic: '/ˈkoʊ.zi/',
        partOfSpeech: 'adjective',
        meaning: 'ấm cúng, thoải mái, dễ chịu',
        example: 'This cafe has such a cozy and romantic atmosphere.',
        exampleMeaning: 'Quán cà phê này có không gian ấm cúng và lãng mạn ghê.',
        memoryTip: 'Cảm giác như trùm chăn ấm uống ly cacao nóng cùng nhau.'
      },
      {
        word: 'rendezvous',
        phonetic: '/ˈrɑːn.deɪ.vuː/',
        partOfSpeech: 'noun',
        meaning: 'buổi hẹn hò bí mật lãng mạn',
        example: 'Our secret rendezvous at the rooftop bar was unforgettable.',
        exampleMeaning: 'Buổi hẹn hò bí mật ở quán bar tầng thượng thật khó quên.',
        memoryTip: 'Từ gốc Pháp cực sang chảnh chỉ cuộc hẹn riêng 2 người.'
      },
      {
        word: 'stroll',
        phonetic: '/stroʊl/',
        partOfSpeech: 'verb',
        meaning: 'đi dạo thong thả bên nhau',
        example: 'Let’s take a romantic stroll around the lake tonight.',
        exampleMeaning: 'Tối nay mình nắm tay đi dạo quanh bờ hồ nhé.',
        memoryTip: 'Đi chậm rãi, ngắm cảnh và trò chuyện cùng nhau.'
      },
      {
        word: 'savory',
        phonetic: '/ˈseɪ.vər.i/',
        partOfSpeech: 'adjective',
        meaning: 'đậm đà, thơm béo (vị mặn)',
        example: 'I love savory Vietnamese street foods like banh mi.',
        exampleMeaning: 'Anh mê các món ăn vặt đường phố đậm đà như bánh mì.',
        memoryTip: 'Ngược lại với sweet (ngọt), savory là vị mặn mà vừa miệng.'
      },
      {
        word: 'delicacy',
        phonetic: '/ˈdel.ə.kə.si/',
        partOfSpeech: 'noun',
        meaning: 'món cao lương mỹ vị, đặc sản ngon',
        example: 'We must try the local seafood delicacy in Da Nang.',
        exampleMeaning: 'Tụi mình nhất định phải thử món đặc sản hải sản ở Đà Nẵng.',
        memoryTip: 'Delicate (tinh tế) -> món ăn được chế biến công phu.'
      },
      {
        word: 'ambiance',
        phonetic: '/ˈæm.bi.əns/',
        partOfSpeech: 'noun',
        meaning: 'bầu không khí, cảm xúc của không gian',
        example: 'The soft jazz music gave the restaurant a dreamy ambiance.',
        exampleMeaning: 'Nhạc jazz êm dịu tạo cho nhà hàng một không gian thật mộng mơ.',
        memoryTip: 'Bầu không khí xung quanh tạo cảm xúc thư thái.'
      },
      {
        word: 'craving',
        phonetic: '/ˈkreɪ.vɪŋ/',
        partOfSpeech: 'noun',
        meaning: 'cơn thèm ăn da diết một món nào đó',
        example: 'I have a huge craving for bubble milk tea right now!',
        exampleMeaning: 'Tự dưng em thèm trà sữa trân châu dã man luôn nè!',
        memoryTip: 'Cảm giác bồn chồn muốn ăn ngay lập tức món khoái khẩu.'
      },
      {
        word: 'splurge',
        phonetic: '/splɜːrdʒ/',
        partOfSpeech: 'verb',
        meaning: 'chi tiêu mạnh tay để tự thưởng / chiều chuộng',
        example: 'Let’s splurge on a fancy dinner for our anniversary.',
        exampleMeaning: 'Kỷ niệm ngày yêu mình chi mạnh tay đi ăn tối sang chảnh nha.',
        memoryTip: 'Vung tay một chút để tạo bất ngờ và chiều người yêu.'
      },
      {
        word: 'unwind',
        phonetic: '/ʌnˈwaɪnd/',
        partOfSpeech: 'verb',
        meaning: 'thư giãn xả hơi sau một ngày mệt nhoài',
        example: 'Sitting with you is the best way to unwind after work.',
        exampleMeaning: 'Ngồi bên em là cách tuyệt nhất để anh xả stress sau giờ làm.',
        memoryTip: 'Tháo gỡ những căng thẳng, nhẹ nhõm cả người.'
      }
    ]
  },
  {
    id: 'pack_travel',
    title: 'Du Lịch & Chuyến Đi Trốn',
    topic: 'Du Lịch Khám Phá',
    emoji: '✈️',
    description: 'Từ vựng để hai đứa cùng lên lịch trình và sống ảo mọi cung đường',
    gradient: 'from-sky-500 to-indigo-500',
    words: [
      {
        word: 'wanderlust',
        phonetic: '/ˈwɑːn.dɚ.lʌst/',
        partOfSpeech: 'noun',
        meaning: 'niềm đam mê xê dịch, thích đi đây đi đó',
        example: 'Our shared wanderlust brought us to beautiful Da Lat.',
        exampleMeaning: 'Niềm đam mê xê dịch của hai đứa đã đưa mình đến Đà Lạt mộng mơ.',
        memoryTip: 'Wander (đi lang thang) + Lust (khao khát mãnh liệt).'
      },
      {
        word: 'breathtaking',
        phonetic: '/ˈbreθˌteɪ.kɪŋ/',
        partOfSpeech: 'adjective',
        meaning: 'đẹp đến nghẹt thở, ngoạn mục',
        example: 'The mountain sunrise view was absolutely breathtaking.',
        exampleMeaning: 'Khung cảnh bình minh trên đỉnh núi đẹp đến nghẹt thở.',
        memoryTip: 'Đẹp đến mức nín thở vì quá kinh ngạc.'
      },
      {
        word: 'picturesque',
        phonetic: '/ˌpɪk.tʃərˈesk/',
        partOfSpeech: 'adjective',
        meaning: 'đẹp như tranh vẽ, chụp ảnh sống ảo siêu đỉnh',
        example: 'We stayed at a picturesque homestay by the pine forest.',
        exampleMeaning: 'Tụi mình ở một homestay đẹp như tranh bên đồi thông.',
        memoryTip: 'Picture (bức tranh) -> Cảnh đẹp chụp góc nào cũng như tranh.'
      },
      {
        word: 'getaway',
        phonetic: '/ˈɡet̬.ə.weɪ/',
        partOfSpeech: 'noun',
        meaning: 'chuyến đi trốn ngắn ngày để đổi gió',
        example: 'We need a weekend getaway to the beach to recharge.',
        exampleMeaning: 'Hai đứa mình cần một chuyến đi trốn ra biển cuối tuần để sạc lại năng lượng.',
        memoryTip: 'Get away (rời khỏi thành phố xô bồ).'
      },
      {
        word: 'itinerary',
        phonetic: '/aɪˈtɪn.ə.rer.i/',
        partOfSpeech: 'noun',
        meaning: 'lịch trình chi tiết của chuyến đi',
        example: 'My husband planned a perfect 3-day travel itinerary.',
        exampleMeaning: 'Cục chồng đã lên một lịch trình du lịch 3 ngày quá chuẩn chỉnh.',
        memoryTip: 'Lịch trình từng giờ từng quán ăn trong tab Kế Hoạch.'
      },
      {
        word: 'souvenir',
        phonetic: '/ˌsuː.vəˈnɪr/',
        partOfSpeech: 'noun',
        meaning: 'quà lưu niệm mang về',
        example: 'I bought this cute couple keychain as a trip souvenir.',
        exampleMeaning: 'Em mua chiếc móc khóa đôi đáng yêu này làm kỷ niệm chuyến đi.',
        memoryTip: 'Món đồ nhỏ giữ lại ký ức đẹp.'
      },
      {
        word: 'scenic',
        phonetic: '/ˈsiː.nɪk/',
        partOfSpeech: 'adjective',
        meaning: 'có phong cảnh thiên nhiên đẹp mắt',
        example: 'Let’s drive through the scenic coastal road.',
        exampleMeaning: 'Mình cùng lái xe qua cung đường ven biển tuyệt đẹp này nhé.',
        memoryTip: 'Gốc từ scene (cảnh vật).'
      },
      {
        word: 'memorable',
        phonetic: '/ˈmem.ər.ə.bəl/',
        partOfSpeech: 'adjective',
        meaning: 'đáng nhớ, in sâu vào ký ức',
        example: 'Our first trip together was truly memorable.',
        exampleMeaning: 'Chuyến đi đầu tiên cùng nhau thực sự là một kỷ niệm khó phai.',
        memoryTip: 'Memory (kỷ niệm) + able (có thể ghi nhớ mãi).'
      },
      {
        word: 'refreshing',
        phonetic: '/rɪˈfreʃ.ɪŋ/',
        partOfSpeech: 'adjective',
        meaning: 'tươi mới, sảng khoái tinh thần',
        example: 'The cool morning mountain air felt so refreshing.',
        exampleMeaning: 'Không khí se lạnh ban sớm trên núi thật sảng khoái.',
        memoryTip: 'Làm mới lại tâm hồn sau những ngày làm việc mệt mỏi.'
      },
      {
        word: 'voyage',
        phonetic: '/ˈvɔɪ.ɪdʒ/',
        partOfSpeech: 'noun',
        meaning: 'chuyến hành trình dài đầy ý nghĩa',
        example: 'Life is a wonderful voyage when I am with you.',
        exampleMeaning: 'Cuộc đời là một hành trình kỳ diệu khi anh có em đồng hành.',
        memoryTip: 'Hành trình vượt qua mọi nẻo đường cùng nhau.'
      }
    ]
  },
  {
    id: 'pack_communication',
    title: 'Giao Tiếp & Lắng Nghe Thấu Hiểu',
    topic: 'Thấu Hiểu & Gắn Kết',
    emoji: '💬',
    description: 'Từ vựng để hai đứa biết cách dỗ dành, lắng nghe và trân quý nhau hơn',
    gradient: 'from-emerald-500 to-teal-500',
    words: [
      {
        word: 'appreciate',
        phonetic: '/əˈpriː.ʃi.eɪt/',
        partOfSpeech: 'verb',
        meaning: 'biết ơn, trân trọng sự cố gắng của đối phương',
        example: 'I really appreciate everything you do for us.',
        exampleMeaning: 'Anh vô cùng trân trọng và biết ơn mọi điều em làm cho hai đứa.',
        memoryTip: 'Nhận ra và trân quý giá trị người kia mang lại.'
      },
      {
        word: 'thoughtful',
        phonetic: '/ˈθɑːt.fəl/',
        partOfSpeech: 'adjective',
        meaning: 'chu đáo, ân cần, luôn nghĩ cho người khác',
        example: 'Thank you for preparing warm water for me, you are so thoughtful.',
        exampleMeaning: 'Cảm ơn anh đã chuẩn bị nước ấm cho em, anh chu đáo ghê.',
        memoryTip: 'Thought (suy nghĩ) + full (đầy ắp) -> Người luôn tinh tế quan sát.'
      },
      {
        word: 'reassure',
        phonetic: '/ˌriː.əˈʃʊr/',
        partOfSpeech: 'verb',
        meaning: 'trấn an, vỗ về cho người kia an lòng',
        example: 'He kissed her forehead to reassure her that everything will be okay.',
        exampleMeaning: 'Anh hôn lên trán em để trấn an rằng mọi chuyện rồi sẽ ổn thôi.',
        memoryTip: 'Assure (chắc chắn) + re- (lặp lại) -> Mang lại cảm giác an toàn tuyệt đối.'
      },
      {
        word: 'encourage',
        phonetic: '/ɪnˈkɝː.ɪdʒ/',
        partOfSpeech: 'verb',
        meaning: 'động viên, khích lệ tiếp thêm sức mạnh',
        example: 'She always encourages me to follow my dreams.',
        exampleMeaning: 'Cô ấy luôn khích lệ anh theo đuổi ước mơ của mình.',
        memoryTip: 'Courage (dũng khí) -> Tiếp thêm dũng khí cho người yêu.'
      },
      {
        word: 'patient',
        phonetic: '/ˈpeɪ.ʃənt/',
        partOfSpeech: 'adjective',
        meaning: 'kiên nhẫn, nhẫn nại, không nóng vội',
        example: 'Thank you for being so patient whenever I am grumpy.',
        exampleMeaning: 'Cảm ơn anh vì đã luôn kiên nhẫn mỗi khi em hờn dỗi.',
        memoryTip: 'Biết kiềm chế và dịu dàng lắng nghe cơn dỗi.'
      },
      {
        word: 'compliment',
        phonetic: '/ˈkɑːm.plə.mənt/',
        partOfSpeech: 'noun',
        meaning: 'lời khen ngợi chân thành và ngọt ngào',
        example: 'A sweet compliment from you brightens my whole day.',
        exampleMeaning: 'Một lời khen ngọt ngào từ em làm sáng bừng cả ngày của anh.',
        memoryTip: 'Khen người yêu xinh đẹp, giỏi giang mỗi ngày.'
      },
      {
        word: 'supportive',
        phonetic: '/səˈpɔːr.t̬ɪv/',
        partOfSpeech: 'adjective',
        meaning: 'luôn ủng hộ, làm hậu phương vững chắc',
        example: 'Having a supportive partner is the greatest blessing.',
        exampleMeaning: 'Có một người bạn đời luôn ủng hộ là phước lành lớn nhất.',
        memoryTip: 'Support (chỗ dựa) -> Luôn bên cạnh ủng hộ mọi quyết định.'
      },
      {
        word: 'forgive',
        phonetic: '/fɚˈɡɪv/',
        partOfSpeech: 'verb',
        meaning: 'tha thứ, bỏ qua lỗi lầm nhỏ',
        example: 'Please forgive me for being late today, I promise to make it up.',
        exampleMeaning: 'Tha lỗi cho anh vì hôm nay đến muộn nhé, anh sẽ bù đắp cho em.',
        memoryTip: 'Mở rộng lòng mình để tình yêu bền chặt.'
      },
      {
        word: 'listen',
        phonetic: '/ˈlɪs.ən/',
        partOfSpeech: 'verb',
        meaning: 'lắng nghe bằng cả trái tim',
        example: 'Whenever you feel sad, I am always here to listen.',
        exampleMeaning: 'Bất cứ khi nào em buồn, anh luôn ở đây để lắng nghe em.',
        memoryTip: 'Không chỉ nghe bằng tai mà thấu hiểu bằng tim.'
      },
      {
        word: 'grateful',
        phonetic: '/ˈɡreɪt.fəl/',
        partOfSpeech: 'adjective',
        meaning: 'biết ơn cuộc đời vì đã có nhau',
        example: 'I am so grateful to have you by my side every single day.',
        exampleMeaning: 'Anh thật lòng biết ơn vì mỗi ngày đều có em kề bên.',
        memoryTip: 'Cảm giác may mắn và trân quý từng phút giây bên nhau.'
      }
    ]
  },
  {
    id: 'pack_smart',
    title: 'Tiếng Anh Thông Minh & Cùng Tiến Bộ',
    topic: 'Từ Vựng Nâng Cao',
    emoji: '🧠',
    description: 'Từ vựng xịn xò giúp hai đứa nâng tầm vốn từ, giao tiếp thông minh hơn',
    gradient: 'from-violet-500 to-purple-600',
    words: [
      {
        word: 'resilience',
        phonetic: '/rɪˈzɪl.jəns/',
        partOfSpeech: 'noun',
        meaning: 'sự kiên cường, khả năng bật dậy sau khó khăn',
        example: 'I admire your strength and resilience in difficult times.',
        exampleMeaning: 'Anh vô cùng khâm phục sự kiên cường của em trong những lúc khó khăn.',
        memoryTip: 'Khả năng đàn hồi, dù bị đè nén vẫn vươn lên mạnh mẽ.'
      },
      {
        word: 'perseverance',
        phonetic: '/ˌpɝː.səˈvɪr.əns/',
        partOfSpeech: 'noun',
        meaning: 'tính bền bỉ, kiên trì theo đuổi mục tiêu',
        example: 'With love and perseverance, we can overcome any obstacle.',
        exampleMeaning: 'Với tình yêu và sự kiên trì, tụi mình có thể vượt qua mọi rào cản.',
        memoryTip: 'Severe (khắt khe) -> Vượt qua thử thách bằng sự bền bỉ.'
      },
      {
        word: 'meticulous',
        phonetic: '/məˈtɪk.jə.ləs/',
        partOfSpeech: 'adjective',
        meaning: 'tỉ mỉ, cẩn thận từng chi tiết nhỏ',
        example: 'She takes meticulous care of our little home.',
        exampleMeaning: 'Cô ấy chăm sóc tổ ấm nhỏ của hai đứa vô cùng tỉ mỉ.',
        memoryTip: 'Người chú ý đến từng chi tiết nhỏ nhất.'
      },
      {
        word: 'eloquent',
        phonetic: '/ˈel.ə.kwənt/',
        partOfSpeech: 'adjective',
        meaning: 'nói năng lưu loát, truyền cảm và thuyết phục',
        example: 'Your heartfelt letter was so eloquent and touching.',
        exampleMeaning: 'Lá thư chân thành của em viết thật lưu loát và xúc động.',
        memoryTip: 'Cách diễn đạt câu từ trau chuốt, đi vào lòng người.'
      },
      {
        word: 'proactive',
        phonetic: '/proʊˈæk.tɪv/',
        partOfSpeech: 'adjective',
        meaning: 'chủ động, đi trước đón đầu',
        example: 'Being proactive in resolving conflicts makes our love stronger.',
        exampleMeaning: 'Chủ động giải quyết mâu thuẫn giúp tình yêu của hai đứa bền chặt hơn.',
        memoryTip: 'Không đợi người khác nhắc mà tự giác làm trước.'
      },
      {
        word: 'innovative',
        phonetic: '/ˈɪn.ə.veɪ.t̬ɪv/',
        partOfSpeech: 'adjective',
        meaning: 'sáng tạo, đổi mới mẻ',
        example: 'You always come up with innovative dating ideas!',
        exampleMeaning: 'Em luôn nghĩ ra những ý tưởng hẹn hò cực kỳ mới mẻ và sáng tạo!',
        memoryTip: 'Innovate (cải tiến) -> luôn làm mới tình yêu để không nhàm chán.'
      },
      {
        word: 'collaborate',
        phonetic: '/kəˈlæb.ə.reɪt/',
        partOfSpeech: 'verb',
        meaning: 'cùng nhau cộng tác, phối hợp ăn ý',
        example: 'We collaborate seamlessly when planning our future together.',
        exampleMeaning: 'Tụi mình phối hợp cực kỳ ăn ý khi cùng lên kế hoạch tương lai.',
        memoryTip: 'Co (cùng) + Labor (làm việc) = Cùng chung sức.'
      },
      {
        word: 'prioritize',
        phonetic: '/praɪˈɔːr.ə.taɪz/',
        partOfSpeech: 'verb',
        meaning: 'ưu tiên điều quan trọng nhất',
        example: 'I always prioritize your happiness above everything else.',
        exampleMeaning: 'Anh luôn ưu tiên niềm hạnh phúc của em lên trên hết mọi thứ.',
        memoryTip: 'Priority (sự ưu tiên) -> Đặt người yêu ở vị trí số 1.'
      },
      {
        word: 'accomplish',
        phonetic: '/əˈkɑːm.plɪʃ/',
        partOfSpeech: 'verb',
        meaning: 'hoàn thành xuất sắc mục tiêu đề ra',
        example: 'Together, we have accomplished so many milestones.',
        exampleMeaning: 'Cùng nhau, hai đứa mình đã hoàn thành được rất nhiều cột mốc ý nghĩa.',
        memoryTip: 'Đạt được thành quả sau chuỗi ngày nỗ lực.'
      },
      {
        word: 'prosperity',
        phonetic: '/prɑːˈsper.ə.t̬i/',
        partOfSpeech: 'noun',
        meaning: 'sự thịnh vượng, sung túc và phát đạt',
        example: 'Wishing our little family endless love and prosperity.',
        exampleMeaning: 'Chúc cho gia đình nhỏ của chúng mình luôn tràn ngập yêu thương và sung túc.',
        memoryTip: 'Cuộc sống no ấm, hạnh phúc đủ đầy.'
      }
    ]
  }
];

export const COUPLE_REWARDS_POOL = [
  'Được bao 1 ly trà sữa trân châu full topping 🧋',
  'Được đối phương massage vai gáy 15 phút 💆',
  'Nhận ngay 50 nụ hôn ngọt ngào bất ngờ 💋',
  'Miễn rửa bát & dọn dẹp trong 1 ngày 🍽️',
  'Được chọn quán ăn ngon cuối tuần tùy thích 🍕',
  'Được đối phương nấu cho 1 bữa ăn thịnh soạn 🍳',
  'Được đối phương gọt trái cây mang tận giường 🍓',
  'Được cục yêu ôm ngủ suốt đêm không buông 🫂',
  'Tự do chọn 1 bộ phim lãng mạn cùng xem tối nay 🎬',
  'Được đối phương mua tặng 1 món đồ ngọt khoái khẩu 🍰'
];
