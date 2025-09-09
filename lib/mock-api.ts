export function generateMockStory(template: string, prompt: string, length = "medium") {
  const stories = {
    kids: {
      short: {
        title: "Luna's Starlight Friend",
        content: `Luna loved looking at stars from her window. One night, a tiny star fell right into her room! "Hello Luna," whispered the star. "I'm lost. Can you help me find my way home?" Luna smiled and gently carried the star outside. Together, they found the perfect spot in the sky where the star belonged. "Thank you," twinkled the star. "Now I'll always shine extra bright for you!" From that night on, Luna had her very own special star watching over her.`,
      },
      medium: {
        title: "The Magical Adventure of Luna",
        content: `Once upon a time, in a cozy little village nestled between rolling hills and whispering woods, there lived a curious young girl named Luna. She had sparkling eyes that seemed to hold all the wonder of the night sky, and a heart full of dreams.

Every evening, Luna would sit by her bedroom window, gazing up at the twinkling stars and wondering what adventures awaited beyond the horizon. Little did she know that tonight would be different from all the others.

As the clock struck midnight, a gentle silver light began to dance outside her window. Luna rubbed her eyes, thinking she must be dreaming, but the light grew brighter and more beautiful. Suddenly, a tiny voice called out to her.

"Luna! Luna! We've been waiting for you!" 

She looked closer and gasped in amazement. There, floating just outside her window, was a group of the most beautiful fireflies she had ever seen. But these weren't ordinary fireflies – they glowed with all the colors of the rainbow and seemed to shimmer with magic.

"Who are you?" Luna whispered, her voice filled with wonder.

"We are the Dream Weavers," said the brightest firefly, whose light pulsed like a tiny heartbeat. "We travel the world, collecting dreams and turning them into beautiful stories. Tonight, we need your help."

And so began Luna's most magical adventure, one that would teach her that the greatest magic of all comes from believing in yourself and the power of dreams.`,
      },
      long: {
        title: "Luna and the Kingdom of Dreams",
        content: `In a village where the mountains touched the clouds and rivers sang lullabies, lived a girl named Luna whose imagination knew no bounds. Every night, she would create elaborate stories about the stars, giving each one a name and a personality. Her grandmother often said that Luna had been born with stardust in her veins.

On her tenth birthday, something extraordinary happened. As Luna was making her birthday wish upon the brightest star, a shimmering portal opened in her bedroom wall. Through it stepped a magnificent creature – part butterfly, part phoenix – with wings that sparkled like galaxies.

"Greetings, Luna," the creature spoke in a voice like wind chimes. "I am Celestia, Guardian of the Dream Kingdom. Your stories have reached our realm, and we need your help. The Dream Weaver's loom has been broken by the Shadow of Doubt, and without it, no new dreams can be created for children around the world."

Luna's heart raced with excitement and purpose. She followed Celestia through the portal into a world where thoughts took physical form, where courage appeared as golden bridges across impossible chasms, and where kindness bloomed into gardens of healing flowers.

Their journey led them through the Valley of Forgotten Wishes, across the Bridge of What-If, and finally to the Crystal Palace where the Dream Weaver waited. The ancient being, wise and gentle, explained that only someone who truly believed in the power of imagination could repair the magical loom.

As Luna worked to mend the golden threads, she realized that each strand represented a child's hope, a parent's love, a dreamer's aspiration. With careful hands and an open heart, she wove together not just the loom, but the very fabric of possibility itself.

When she returned home, Luna discovered that her adventure had lasted only moments in real time, but the experience had changed her forever. She now understood that every story she told, every dream she shared, had the power to inspire and heal. And sometimes, late at night, she could still hear Celestia's voice on the wind, reminding her that the greatest magic lives within those brave enough to dream.`,
      },
    },
    adventure: {
      short: {
        title: "The Hidden Cave",
        content: `Jake found an old map in his grandfather's attic. It showed a cave marked with an X just beyond the forest. Armed with a flashlight and his courage, Jake ventured into the woods. The cave was dark and mysterious, but deep inside, he discovered ancient paintings on the walls – stories of brave explorers from long ago. Jake realized he had found something more valuable than treasure: a connection to the adventurers who came before him.`,
      },
      medium: {
        title: "The Quest for the Golden Compass",
        content: `The ancient map crackled in Maya's weathered hands as she stood at the edge of the Whispering Canyon. For three years, she had searched for the legendary Golden Compass, a mystical artifact said to guide its bearer to their heart's deepest desire.

The wind carried whispers of those who had come before her – brave souls who had ventured into the canyon's depths, seeking the same prize. Some had returned with tales of wonder, others had never returned at all.

Maya adjusted her leather satchel and checked her supplies one final time. The rope, the lantern, the provisions – everything was ready. But more importantly, her spirit was prepared for whatever lay ahead.

As she began her descent into the canyon, the walls seemed to close in around her, carved with symbols from civilizations long forgotten. Each step echoed with the weight of history, and she could feel the presence of ancient guardians watching her every move.

Hours passed as she navigated treacherous ledges and hidden passages. Just when exhaustion threatened to overwhelm her, she spotted it – a glimmer of gold emanating from a chamber deep within the canyon's heart.

The Golden Compass sat upon a pedestal of crystalline stone, its surface reflecting not just light, but the very essence of hope itself. As Maya reached for it, she realized that the true treasure wasn't the compass at all, but the courage she had discovered within herself during the journey.

With the compass in hand, she understood its first lesson: sometimes the greatest adventures lead us not to distant lands, but to the strength we never knew we possessed.`,
      },
      long: {
        title: "The Expedition to the Lost City of Aethros",
        content: `Dr. Elena Vasquez had spent fifteen years studying the cryptic references to Aethros, a city that supposedly vanished overnight three thousand years ago. Unlike other archaeologists who dismissed it as myth, Elena believed the scattered clues pointed to a real place hidden somewhere in the Amazon rainforest.

Her expedition team consisted of Marcus, a survival expert who could navigate any terrain; Dr. Yuki Tanaka, a linguist specializing in dead languages; and Carlos, a local guide whose grandfather claimed to have seen the city's golden spires in his youth. Together, they ventured into uncharted territory where GPS signals failed and compasses spun wildly.

The first week tested their resolve as they battled through dense vegetation, crossed treacherous rivers, and endured torrential rains that seemed to wash away their progress each night. But Elena's determination never wavered, especially when they discovered stone markers carved with symbols that matched her research.

On the tenth day, they found it – not the ruins they expected, but a living city hidden beneath a canopy so thick it blocked out the sun. The descendants of Aethros had survived by adapting to their environment, building homes in the trees and developing a sustainable way of life that left no trace visible from above.

The city's elder, a woman named Itzel whose eyes held the wisdom of generations, welcomed them with cautious curiosity. Through Dr. Tanaka's translation skills, they learned that Aethros hadn't vanished – it had chosen to hide from a world that threatened to destroy its harmony with nature.

Elena realized that her greatest discovery wasn't just finding a lost city, but understanding that some treasures are meant to remain hidden, protected by those wise enough to know their true value. She documented their encounter respectfully, ensuring that Aethros would remain safe while sharing its message of environmental harmony with the world.

The expedition returned with more than artifacts and photographs – they brought back a new understanding of what it means to truly explore, not just the world around us, but the wisdom within ourselves and the responsibility we have to protect what we discover.`,
      },
    },
    inspirational: {
      short: {
        title: "The Small Light",
        content: `Emma felt invisible at school until the day she helped a new student find her classroom. That simple act of kindness started a chain reaction. Soon, Emma was known as the girl who always helped others. She learned that being extraordinary doesn't mean being the loudest or the smartest – sometimes it just means being kind. Her small light had illuminated the whole school.`,
      },
      medium: {
        title: "The Light Within",
        content: `Sarah had always believed that she was ordinary. In a world full of extraordinary people doing extraordinary things, she felt like a small candle in a room full of blazing torches. Every day, she watched others shine brightly while she remained in the shadows, convinced that she had nothing special to offer.

It was during the darkest period of her life, when everything seemed to be falling apart, that she discovered something remarkable. Her elderly neighbor, Mrs. Chen, had fallen ill, and Sarah found herself stopping by each day to help with small tasks – bringing groceries, tidying up, simply sitting and listening.

"You know, dear," Mrs. Chen said one afternoon, her eyes twinkling with wisdom, "you have a gift that many people spend their whole lives searching for."

Sarah looked puzzled. "What gift? I'm not talented like other people. I can't paint beautiful pictures or write moving songs or solve complex problems."

Mrs. Chen smiled gently. "You have the gift of presence, Sarah. When you're here with me, I feel seen, heard, and valued. You make people feel like they matter. That's not ordinary – that's extraordinary."

As the weeks passed, Sarah began to notice how her simple acts of kindness created ripples of joy around her. A smile to the stressed cashier, a listening ear for a worried friend, a helping hand for a struggling colleague – each gesture seemed small to her, but created profound impacts in others' lives.

She realized that being extraordinary didn't mean being the loudest voice in the room or the most talented person in the crowd. Sometimes, it meant being the gentle light that helps others find their way through darkness.

Sarah learned that we all have a unique light within us, and when we let it shine – no matter how small we think it is – we illuminate the world in ways we never imagined possible.`,
      },
      long: {
        title: "The Teacher Who Changed Everything",
        content: `Maria Santos had been teaching for twenty-three years when she met the class that would change her life forever. Room 204 was filled with students that other teachers had given up on – kids from broken homes, struggling learners, and those who had been labeled as "problems." The principal apologetically assigned her to this class, expecting her to simply maintain order until the end of the year.

But Maria saw something different when she looked at these children. She saw potential hidden beneath layers of hurt, intelligence masked by frustration, and dreams that had been told they were impossible. Instead of lowering her expectations, she raised them higher than anyone thought reasonable.

She started small, learning each child's story. There was Marcus, whose anger stemmed from watching his mother work three jobs to keep their family afloat. Sophia, whose silence came from being told she wasn't smart enough to succeed. David, whose class clown behavior masked his fear of failure. Each child carried invisible wounds that affected their ability to learn and trust.

Maria transformed her classroom into a sanctuary where mistakes were celebrated as learning opportunities, where every student's voice mattered, and where dreams were nurtured rather than dismissed. She stayed after school to tutor, visited homes to understand her students' challenges, and fought administrators who wanted to lower standards rather than provide support.

The transformation didn't happen overnight. There were setbacks, tears, and moments when Maria questioned whether she was making any difference at all. But gradually, something beautiful began to emerge. Marcus channeled his passion into poetry that moved audiences to tears. Sophia discovered her gift for mathematics and began tutoring younger students. David's humor became a tool for bringing joy and healing to others.

By the end of the year, Room 204 had the highest test scores in the school, but more importantly, it had become a family. These students who had been written off were now writing their own success stories, applying to colleges, and pursuing dreams they never thought possible.

Years later, as Maria received letters from doctors, teachers, artists, and entrepreneurs who had once sat in Room 204, she realized that teaching had never been about imparting knowledge – it had been about believing in the unlimited potential within every human being and having the courage to nurture it, even when no one else could see it.

Maria learned that sometimes the greatest gift we can give someone is not our expertise or our resources, but our unwavering belief in their ability to rise above their circumstances and become who they were meant to be.`,
      },
    },
    custom: {
      short: {
        title: "Your Story Begins",
        content: `This is where your unique story would unfold – a brief but powerful tale crafted from your imagination. In just a few paragraphs, we would capture the essence of your idea and bring it to life with vivid characters and meaningful moments.`,
      },
      medium: {
        title: "A Story Just for You",
        content: `This is where your unique story would unfold, crafted specifically from the ideas and dreams you've shared. Every custom story is a one-of-a-kind creation, woven from the threads of your imagination and brought to life through the magic of storytelling.

Your story would capture the essence of what you've described, whether it's a tale of courage and adventure, a heartwarming story of friendship and love, or a journey of self-discovery and growth. The characters would feel real and relatable, the setting would be vivid and immersive, and the message would resonate deeply with your heart.

In your custom story, every detail would matter – from the way the morning light filters through the windows to the sound of laughter echoing through the halls. The emotions would be authentic, the challenges meaningful, and the resolution satisfying.

This is just a preview of what your personalized story could become. Each custom tale is carefully crafted to reflect your unique perspective, experiences, and dreams, creating something truly special that belongs entirely to you.

What story would you like to tell? What characters would you like to meet? What adventures would you like to embark upon? The possibilities are endless, and your story is waiting to be written.`,
      },
      long: {
        title: "Your Epic Tale Awaits",
        content: `This is where your epic story would unfold across multiple chapters, diving deep into the world you've imagined. With rich character development, intricate plot lines, and detailed world-building, your long-form story would be a complete journey that readers could lose themselves in.

Every character would have depth and motivation, every scene would serve the greater narrative, and every chapter would leave readers eager for more. Whether you envision a sweeping fantasy epic, a complex family saga, or an intricate mystery, your story would be crafted with the care and attention it deserves.

The beauty of a longer story lies in its ability to explore themes thoroughly, develop relationships authentically, and create a world that feels completely real. Readers would form deep connections with your characters, experience genuine emotions throughout their journey, and come away with insights that linger long after the final page.

Your epic tale would be uniquely yours – a reflection of your creativity, your values, and your vision for what stories can accomplish. It would be the kind of story that gets passed down, shared with friends, and remembered for years to come.`,
      },
    },
  }

  const selectedTemplate = stories[template as keyof typeof stories] || stories.custom
  const selectedStory = selectedTemplate[length as keyof typeof selectedTemplate] || selectedTemplate.medium

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: selectedStory.title,
    content: selectedStory.content,
    template,
    length,
    readTime: length === "short" ? "1-2 min" : length === "medium" ? "3-5 min" : "6-10 min",
    createdAt: new Date().toISOString(),
  }
}
