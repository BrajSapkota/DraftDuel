"use strict";

const MODES=[
  {id:'knockout',group:'Draft',icon:'🥊',name:'Knockout Auction',tag:'Last player standing',kind:'draft',desc:'Build value fast. The lowest-value lineup is eliminated at knockout checkpoints.',rules:'Draft songs in turn. After every two complete cycles, the active player with the lowest collection value is knocked out.'},
  {id:'salary',group:'Draft',icon:'💰',name:'Salary Cap Draft',tag:'Spend with a plan',kind:'draft',priced:true,desc:'Every song has a price and every player has the same $30 cap.',rules:'Choose any available song you can afford. Build the strongest collection before your cap runs out.'},
  {id:'teams',group:'Draft',icon:'🤝',name:'Team Battle',tag:'Shared glory',kind:'draft',teams:true,desc:'Players alternate for Team Purple and Team Lime.',rules:'Players still choose individually, but picks and points combine into two team totals.'},
  {id:'steal',group:'Draft',icon:'🫳',name:'Steal Round',tag:'No pick is safe',kind:'draft',steal:true,desc:'Special rounds let the active player steal a rival’s song.',rules:'Draft normally. On highlighted steal turns, take an opponent’s pick instead of choosing from the pool.'},
  {id:'mystery',group:'Trivia',icon:'❓',name:'Mystery Item',tag:'Bid on the clues',kind:'mystery',desc:'Reveal clues one at a time and race to identify the hidden song.',rules:'Start with the release decade, then reveal artwork and artist clues. Award the point to the first correct player.'},
  {id:'category',group:'Draft',icon:'🗂️',name:'Category Challenge',tag:'Fill every slot',kind:'draft',slots:['Party starter','Throwback','Emotional pick','Wildcard'],desc:'Build a balanced lineup by filling a different musical slot each turn.',rules:'The current slot appears above the pool. Pick the song that best fits it—then defend your choice.'},
  {id:'snake',group:'Draft',icon:'🐍',name:'Snake Draft',tag:'Back and forth',kind:'draft',snake:true,desc:'No money: the order reverses after every complete round.',rules:'P1 → P2 → P3, then P3 → P2 → P1. Every song can only be taken once.'},
  {id:'lightning',group:'Draft',icon:'⚡',name:'Lightning Auction',tag:'12-second turns',kind:'draft',timer:12,desc:'Choose quickly before your turn automatically passes.',rules:'Each player has 12 seconds to choose. Running out of time skips the turn.'},
  {id:'allin',group:'Draft',icon:'🔥',name:'All-In Mode',tag:'Risk everything',kind:'draft',priced:true,allin:true,desc:'Premium songs cost more, and reaching $0 locks you out.',rules:'Spend from a $20 budget. Players at $0 cannot draft again, so an early splurge can end your game.'},
  {id:'prediction',group:'Party',icon:'🔮',name:'Prediction Mode',tag:'Read the room',kind:'vote',prompts:['Who will choose the biggest throwback?','Who knows the most lyrics?','Who would build the best festival?','Who is most likely to go all-in?'],desc:'Predict which player best matches the musical prompt.',rules:'Discuss the prompt, lock in the group prediction, and award the point when the room agrees.'},
  {id:'ranked',group:'Draft',icon:'🏆',name:'Ranked Duel',tag:'Two-player showdown',kind:'draft',min:2,max:2,ranked:true,desc:'A focused head-to-head draft with a locally saved win streak.',rules:'Two players take alternating picks. Collection value breaks the tie and the winner’s local streak is saved.'},
  {id:'compatibility',group:'Draft',icon:'💞',name:'Compatibility Challenge',tag:'Find shared favourites',kind:'draft',desc:'Draft from multiple artists and compare how similar your final lineups are.',rules:'Choose from a mixed artist pool. At the end, shared artists and closely matched collection values earn a compatibility badge.'},
  {id:'trade',group:'Draft',icon:'🔁',name:'Draft & Trade',tag:'Make a deal',kind:'draft',trade:true,desc:'Draft first, then use the trade table to swap songs.',rules:'Complete the draft, select one pick from two players, and confirm a one-for-one trade before final scoring.'},
  {id:'sabotage',group:'Party',icon:'😈',name:'Sabotage Mode',tag:'One power each',kind:'draft',sabotage:true,desc:'Every player can remove one tempting song before choosing.',rules:'Use Sabotage once per game to discard a visible song from the pool, then make your normal pick.'},
  {id:'album',group:'Creative',icon:'💿',name:'Album Builder',tag:'Create a classic',kind:'draft',slots:['Opening track','Lead single','Deep cut','Feature','Closing track'],desc:'Fill the roles of a complete album and name your final project.',rules:'Draft one song for each album slot. At the end, reveal and compare everyone’s tracklists.'},
  {id:'aux',group:'Party',icon:'🎧',name:'Aux Battle',tag:'Play the perfect song',kind:'submission',prompts:['Best road-trip opener','Song that saves the party','Main-character entrance','Late-night drive','Instant dance-floor hit'],desc:'Everyone secretly submits a song for the prompt, then the room votes.',rules:'Pass the device for private choices. Submissions are revealed anonymously before the winning DJ is shown.'},
  {id:'name-song',group:'Trivia',icon:'🎵',name:'Name That Song',tag:'Hear it. Know it.',kind:'name',desc:'Play an available preview with its identity hidden.',rules:'Listen to the clip, then reveal the answer and award a point to whoever called it first.'},
  {id:'playlist-prompt',group:'Creative',icon:'📝',name:'Playlist Prompt',tag:'Best musical answer',kind:'submission',prompts:['Villain entrance music','A song for winning the lottery','Worst first-date soundtrack','End credits after a perfect day','Training montage anthem'],desc:'Choose the funniest or smartest song for a creative scenario.',rules:'Everyone submits privately. Reveal the choices, debate, and vote for the best match.'},
  {id:'timeline',group:'Trivia',icon:'🕰️',name:'Music Timeline',tag:'When did it drop?',kind:'timeline',desc:'Place songs in time by identifying their release year.',rules:'Each player gets a song and four possible years. A correct answer earns one point.'},
  {id:'beat-tap',group:'Rhythm',icon:'🥁',name:'Beat Tap',tag:'Feel the tempo',kind:'beat',desc:'Tap eight steady beats as close as possible to the song’s target tempo.',rules:'Listen to the preview, tap eight times, and receive an accuracy score based on timing consistency and BPM.'},
  {id:'impostor',group:'Party',icon:'🕵️',name:'Music Impostor',tag:'Blend in',kind:'impostor',min:3,desc:'Everyone sees the secret song except one player, who only gets the artist.',rules:'Pass the device to reveal private roles, discuss without saying the title, then vote for the impostor.'},
  {id:'festival',group:'Creative',icon:'🎪',name:'Festival Builder',tag:'Book your lineup',kind:'draft',teams:true,slots:['Opening act','Afternoon crowd','Sunset slot','Headliner'],desc:'Teams build rival festival lineups across four time slots.',rules:'Alternating team members book a song for each festival slot. Compare the finished bills and crown the best festival.'}
];

MODES.push(
  {id:'songless',group:'Audio',icon:'🔉',name:'Songless',tag:'Guess the opening',kind:'intro',desc:'Start with half a second and unlock more of the intro after every miss.',rules:'You have six attempts. Every guess or skip restarts at the beginning of the available preview and unlocks 0.5, 1, 2, 4, 8, then 16 seconds.'},
  {id:'songless-daily',group:'Audio',icon:'📆',name:'Daily Songless',tag:'One shared daily song',kind:'intro',daily:true,rounds:1,min:1,max:8,desc:'A deterministic daily intro challenge with streak and share results.',rules:'Everyone gets the same catalogue song for the day. Identify it in six increasingly longer intro clips.'},
  {id:'reverse-audio',group:'Audio',icon:'⏪',name:'Reverse Audio',tag:'Hear it backwards',kind:'intro',audioEffect:'reverse',desc:'Identify a song after its preview is reversed.',rules:'Play the reversed clue, submit a title, and score before all six clues are used.'},
  {id:'speed-control',group:'Audio',icon:'⏩',name:'Speed Control',tag:'Wrong speed, right song',kind:'intro',audioEffect:'speed',desc:'Recognize songs while the preview plays too fast or too slow.',rules:'The playback speed changes each round. Guess the title in as few attempts as possible.'},
  {id:'one-second',group:'Audio',icon:'⚡',name:'One-Second Wonder',tag:'Blink and you miss it',kind:'intro',desc:'Name a song from an intro that starts at just half a second.',rules:'Wrong guesses gradually unlock more audio. Early answers earn more points.'},
  {id:'album-puzzle',group:'Trivia',icon:'🧩',name:'Album Cover Puzzle',tag:'Reveal it tile by tile',kind:'quiz',quiz:'cover',desc:'Identify a track while its artwork slowly becomes visible.',rules:'Reveal fewer tiles for a higher score, then choose who answered correctly.'},
  {id:'artist-connections',group:'Trivia',icon:'🕸️',name:'Artist Connections',tag:'Find the link',kind:'word',prompts:['Name a collaborator linking two artists','Find a shared producer or featured artist','Connect these artists in three steps'],desc:'Explain how artists connect through groups, features, or collaborators.',rules:'The active player gives a valid connection; the room awards the point.'},
  {id:'discography-order',group:'Trivia',icon:'📚',name:'Discography Order',tag:'Oldest to newest',kind:'order',desc:'Arrange four releases into chronological order.',rules:'Drag or tap songs into release order. A perfect timeline earns two points.'},
  {id:'higher-lower',group:'Trivia',icon:'↕️',name:'Higher or Lower',tag:'Newer or older?',kind:'higher',desc:'Predict whether the next song was released before or after the current one.',rules:'Choose higher or lower for the release year. Correct streaks build points.'},
  {id:'song-chain',group:'Words',icon:'🔗',name:'Song Chain',tag:'Last letter, next title',kind:'word',prompts:['Continue the title chain','Name a song beginning with the final letter','Keep the artist chain alive'],timer:20,desc:'Continue a song-title chain without repeating an answer.',rules:'You have 20 seconds to give a valid title. The room accepts or rejects it.'},
  {id:'finish-title',group:'Trivia',icon:'✍️',name:'Finish the Title',tag:'Fill the missing words',kind:'quiz',quiz:'title',desc:'Complete a partially hidden song title.',rules:'Choose the correct full title from four catalogue songs.'},
  {id:'odd-song',group:'Trivia',icon:'🧐',name:'Odd Song Out',tag:'One does not belong',kind:'quiz',quiz:'odd',desc:'Find the one song that belongs to a different artist.',rules:'Three songs share an artist. Select the outsider to score.'},
  {id:'sample-detective',group:'Audio',icon:'🔎',name:'Sample Detective',tag:'Follow your ears',kind:'intro',desc:'Match short preview clues to their artist and title.',rules:'Listen from the beginning of the preview and solve with as few clues as possible.'},
  {id:'music-bingo',group:'Party',icon:'🎟️',name:'Music Bingo',tag:'Mark the moments',kind:'bingo',desc:'Generate cards filled with artists, decades, and musical clues.',rules:'Play songs or call clues. First player to mark a complete line wins.'},
  {id:'setlist-survivor',group:'Words',icon:'🎤',name:'Setlist Survivor',tag:'Build the perfect show',kind:'word',prompts:['Choose the opening song','Name the encore','Pick the crowd singalong','Choose the risky deep cut'],desc:'Defend which song belongs in each concert slot.',rules:'The active player proposes a song and the room awards the strongest choice.'},
  {id:'playlist-detective',group:'Trivia',icon:'🕵️',name:'Playlist Detective',tag:'Find the hidden theme',kind:'quiz',quiz:'theme',desc:'Work out what a set of songs has in common.',rules:'Use artist, decade, and artwork clues to identify the playlist connection.'},
  {id:'music-feud',group:'Party',icon:'📊',name:'Music Family Feud',tag:'Guess the room',kind:'vote',prompts:['Best road-trip artist?','Most iconic party song?','Artist everyone secretly knows?','Best concert opener?'],desc:'Choose the answer you think the room will favour.',rules:'Discuss the survey-style prompt and award the room’s number-one answer.'},
  {id:'chart-time',group:'Trivia',icon:'📈',name:'Chart Time Machine',tag:'Which came first?',kind:'higher',desc:'Compare songs across release years and eras.',rules:'Predict whether the next release is newer or older than the current one.'},
  {id:'cover-original',group:'Trivia',icon:'🎙️',name:'Cover or Original',tag:'Which released first?',kind:'quiz',quiz:'year',desc:'Choose which song from a pair was released first.',rules:'Use the displayed releases and pick the older track.'},
  {id:'collaborator-web',group:'Words',icon:'🕸️',name:'Collaborator Web',tag:'Six degrees of music',kind:'word',prompts:['Connect the two displayed artists','Name a feature that completes the chain','Find a group member or collaborator'],desc:'Build connections between musicians without breaking the chain.',rules:'Give a believable collaboration path before the timer expires.'},
  {id:'genre-blender',group:'Creative',icon:'🌈',name:'Genre Blender',tag:'Two moods, one song',kind:'submission',prompts:['Danceable heartbreak','Acoustic party anthem','Villainous love song','Happy song with sad lyrics'],desc:'Submit the song that best combines two unlikely moods.',rules:'Choose privately, reveal anonymously, and vote for the smartest match.'},

  {id:'rhythm-copycat',group:'Rhythm',icon:'🪘',name:'Rhythm Copycat',tag:'Repeat the pattern',kind:'pattern',desc:'Watch a short four-pad beat and reproduce it.',rules:'Each correct pattern grows by one step. A mistake passes play to the next person.'},
  {id:'beat-builder',group:'Rhythm',icon:'🏗️',name:'Beat Builder',tag:'Add one more beat',kind:'pattern',builder:true,desc:'Players collectively create an expanding rhythm sequence.',rules:'Repeat the full pattern, then add one pad. The longest surviving chain wins.'},
  {id:'tempo-guess',group:'Rhythm',icon:'⏱️',name:'Tempo Guess',tag:'Estimate the BPM',kind:'estimate',estimate:'bpm',desc:'Listen to a preview and estimate its tempo.',rules:'Enter a BPM estimate. Closer guesses earn more points.'},
  {id:'stop-beat',group:'Rhythm',icon:'🛑',name:'Stop the Beat',tag:'Hit the target',kind:'reaction',target:3000,desc:'Stop a hidden timer as close to three seconds as possible.',rules:'Start the beat, count internally, and stop at exactly three seconds.'},
  {id:'rhythm-relay',group:'Rhythm',icon:'🏃',name:'Rhythm Relay',tag:'Pass the pulse',kind:'pattern',desc:'Each player completes one section of a growing rhythm.',rules:'Copy the pattern correctly before passing the device.'},
  {id:'sync-challenge',group:'Rhythm',icon:'🤝',name:'Sync Challenge',tag:'Tap together',kind:'pattern',desc:'Players recreate the same rhythm and compare consistency.',rules:'Each player copies the pattern; the steadiest performance scores highest.'},
  {id:'drum-pad-duel',group:'Rhythm',icon:'🥁',name:'Drum Pad Duel',tag:'Four-pad showdown',kind:'pattern',competitive:true,desc:'Copy increasingly difficult coloured drum-pad patterns.',rules:'Players alternate patterns. Correct sequences earn points.'},
  {id:'silent-beat',group:'Rhythm',icon:'🔇',name:'Silent Beat',tag:'Keep time in silence',kind:'beat',desc:'The preview stops, but your tapping must keep the pulse.',rules:'Listen first, then maintain eight steady taps after the sound fades.'},
  {id:'tempo-trap',group:'Rhythm',icon:'🪤',name:'Tempo Trap',tag:'Did it speed up?',kind:'quiz',quiz:'tempo',desc:'Detect whether an apparent rhythm sped up, slowed down, or stayed steady.',rules:'Listen, trust your internal pulse, and select the change.'},

  {id:'fake-track',group:'Bluff',icon:'🎭',name:'Fake Track',tag:'Invent the believable lie',kind:'text',prompt:'Invent a fake song title for the featured artist.',desc:'Everyone invents a fake title, then hunts for the real one.',rules:'Submit privately. The real catalogue title is mixed into the anonymous vote.'},
  {id:'playlist-impostor',group:'Bluff',icon:'🥸',name:'Playlist Impostor',tag:'Blend into the theme',kind:'impostor',desc:'One player does not know the playlist theme.',rules:'Everyone else sees the theme. Discuss your choices and expose the outsider.'},
  {id:'bad-review',group:'Bluff',icon:'⭐',name:'Bad Review',tag:'Terrible description, famous song',kind:'quiz',quiz:'review',desc:'Identify a song from an intentionally awful description.',rules:'Choose the song that best matches the ridiculous review.'},
  {id:'music-hot-takes',group:'Party',icon:'🌶️',name:'Music Hot Takes',tag:'Predict the room',kind:'vote',prompts:['Albums are better than playlists','The original is always better than the remix','Concert encores are overrated','Lyrics matter more than production'],desc:'Vote on divisive opinions and predict the majority.',rules:'Discuss briefly, then award the point to the player who reads the room.'},
  {id:'secret-fan',group:'Bluff',icon:'🤫',name:'Secret Fan',tag:'Whose favourite is it?',kind:'text',prompt:'Privately enter a favourite artist.',desc:'Match each anonymous favourite artist to a player.',rules:'Submit privately, reveal the list, and vote on who wrote each answer.'},
  {id:'two-hits-lie',group:'Bluff',icon:'🤥',name:'Two Hits and a Lie',tag:'Spot the fake fact',kind:'text',prompt:'Write one believable false music fact.',desc:'Players mix an invented music fact among real-looking claims.',rules:'Submit a lie, read the shuffled claims, and vote for the best bluff.'},
  {id:'pitch-meeting',group:'Creative',icon:'💼',name:'Pitch Meeting',tag:'Sell a ridiculous act',kind:'text',prompt:'Pitch a fictional artist, album, or festival in one sentence.',desc:'Create absurd music concepts and win the room’s backing.',rules:'Pitch privately, reveal anonymously, and vote for the concept you would fund.'},
  {id:'song-court',group:'Party',icon:'⚖️',name:'Song Court',tag:'Defend the controversial track',kind:'vote',prompts:['Is this an undeniable classic?','Does this song deserve the aux?','Is the remix better?','Should this be banned from parties?'],desc:'Prosecute or defend a divisive song before the room votes.',rules:'Debate the displayed prompt, then award the strongest argument.'},
  {id:'who-added',group:'Bluff',icon:'👤',name:'Who Added This?',tag:'Know your friends',kind:'text',prompt:'Privately choose a song that represents you.',desc:'Guess which player submitted every anonymous song choice.',rules:'Submit privately and vote after the anonymous reveal.'},

  {id:'caption-clash',group:'Creative',icon:'💬',name:'Caption Clash',tag:'Write it. Vote it.',kind:'text',prompt:'Write a caption for the displayed album cover.',desc:'Create captions for album artwork and vote anonymously.',rules:'Every player writes one caption. The room votes for the funniest.'},
  {id:'quick-draw',group:'Creative',icon:'✏️',name:'Quick Draw',tag:'Sketch the music prompt',kind:'drawing',desc:'Draw a music prompt while everyone guesses.',rules:'The active player draws without words. Award the first correct guess.'},
  {id:'word-chain',group:'Words',icon:'🔤',name:'Word Chain',tag:'No repeats',kind:'word',prompts:['Artists beginning with the last letter','Songs containing a colour','Albums with one-word titles','Music words A to Z'],timer:15,desc:'Keep a category chain alive under pressure.',rules:'Give a valid unused answer before the timer expires.'},
  {id:'ranking-room',group:'Party',icon:'🥇',name:'Ranking Room',tag:'Predict the group order',kind:'order',desc:'Arrange songs from most to least likely to win the room.',rules:'Order four choices, reveal the timeline, then award the closest prediction.'},
  {id:'majority-rules',group:'Party',icon:'👥',name:'Majority Rules',tag:'Match the room',kind:'vote',prompts:['Concert or headphones?','Lyrics or production?','New release or throwback?','Playlist or full album?'],desc:'Score by choosing the answer most players prefer.',rules:'Discuss the prompt and award players who match the majority.'},
  {id:'minority-wins',group:'Party',icon:'🦄',name:'Minority Wins',tag:'Stand alone',kind:'vote',prompts:['Popular hit or deep cut?','Solo artist or band?','Studio or live version?','Morning music or midnight music?'],desc:'The least popular valid choice wins.',rules:'Vote simultaneously; the smallest group receives the point.'},
  {id:'trivia-wager',group:'Trivia',icon:'🎰',name:'Trivia Wager',tag:'Risk your points',kind:'quiz',quiz:'year',desc:'Bet confidence before answering a music question.',rules:'Choose the correct release, then award bonus points for a brave answer.'},
  {id:'estimation-station',group:'Party',icon:'📐',name:'Estimation Station',tag:'Closest wins',kind:'estimate',estimate:'year',desc:'Estimate release years, BPM, or catalogue facts.',rules:'Enter a number. The closest player wins the round.'},
  {id:'categories-blitz',group:'Words',icon:'💨',name:'Categories Blitz',tag:'Beat the clock',kind:'word',prompts:['Songs with a place in the title','Artists with one-word names','Songs released this decade','Albums beginning with T'],timer:20,desc:'Name as many valid category answers as possible.',rules:'The active player has 20 seconds; the room awards the point for a valid run.'},
  {id:'emoji-decoder',group:'Trivia',icon:'😀',name:'Emoji Decoder',tag:'Read the symbols',kind:'quiz',quiz:'emoji',desc:'Decode song titles represented by emoji clues.',rules:'Choose the catalogue song that matches the emoji clue.'},
  {id:'spot-fake',group:'Bluff',icon:'🔍',name:'Spot the Fake',tag:'One fact is invented',kind:'quiz',quiz:'odd',desc:'Find the false song or artist fact among real catalogue clues.',rules:'Choose the outsider before the answer is revealed.'},
  {id:'memory-grid',group:'Quick',icon:'🧠',name:'Memory Grid',tag:'Remember the sequence',kind:'pattern',desc:'Memorize a growing pattern of colours and symbols.',rules:'Repeat the pattern correctly to earn the point.'},
  {id:'reaction-race',group:'Quick',icon:'🚦',name:'Reaction Race',tag:'Wait for green',kind:'reaction',desc:'Tap only after the signal changes.',rules:'Going early is a false start. Fastest valid reaction earns the best score.'},
  {id:'would-rather',group:'Party',icon:'🤔',name:'Would You Rather',tag:'Predict your friends',kind:'vote',prompts:['Only one artist forever or no repeats ever?','Front row with bad sound or back row with perfect sound?','Lose playlists or lose headphones?','Sing on stage or DJ the afterparty?'],desc:'Choose between music dilemmas and predict the group.',rules:'Debate, choose, and award the player who best predicted the room.'},
  {id:'secret-prompt',group:'Bluff',icon:'🗝️',name:'Secret Prompt',tag:'Find the outsider',kind:'impostor',desc:'Most players receive one prompt while one receives a slightly different one.',rules:'Answer carefully, compare responses, and expose the outsider.'},

  {id:'auction-trivia',group:'Auction',icon:'🧠',name:'Auction Trivia',tag:'Knowledge earns cash',kind:'draft',priced:true,desc:'Trivia-flavoured drafting where valuable catalogue knowledge guides spending.',rules:'Use a $30 cap and choose the releases you believe will score best.'},
  {id:'mystery-auction',group:'Auction',icon:'🎁',name:'Mystery Auction',tag:'Bid on clues',kind:'mystery',desc:'Commit to a mystery item as clues are slowly revealed.',rules:'Reveal decade, artwork, and artist clues before awarding the mystery pick.'},
  {id:'reverse-auction',group:'Auction',icon:'⬇️',name:'Reverse Auction',tag:'Value beats spending',kind:'draft',priced:true,desc:'Build the strongest lineup while spending as little as possible.',rules:'Choose songs under a $30 cap; saved budget acts as a final tiebreaker.'},
  {id:'risky-bid',group:'Auction',icon:'🎲',name:'Risky Bid',tag:'Choose before the reveal',kind:'mystery',desc:'Make decisions from only a decade or artist clue.',rules:'Reveal clues one at a time and award the player who commits earliest.'},
  {id:'power-draft',group:'Auction',icon:'🦸',name:'Power-Up Draft',tag:'Steal, shield, sabotage',kind:'draft',sabotage:true,steal:true,desc:'Every player gets a one-use power during the draft.',rules:'Use sabotage once, and watch for special steal turns.'},
  {id:'team-auction',group:'Auction',icon:'🫶',name:'Team Auction',tag:'One shared strategy',kind:'draft',teams:true,priced:true,desc:'Partners build combined lineups under pressure.',rules:'Players alternate for Purple and Lime; team totals decide the winner.'},
  {id:'genre-monopoly',group:'Auction',icon:'🏘️',name:'Genre Monopoly',tag:'Collect matching sets',kind:'draft',slots:['Pop','R&B','Rock','Wildcard'],desc:'Collect songs across slots and complete musical sets.',rules:'Fill every category slot; balanced lineups earn the strongest collection.'},
  {id:'prediction-auction',group:'Auction',icon:'🔮',name:'Prediction Auction',tag:'Read every pick',kind:'vote',prompts:['Who takes the next premium song?','Who saves the most budget?','Who builds the wildest lineup?','Who wins the final round?'],desc:'Predict players’ auction behaviour as the game unfolds.',rules:'The room selects a prediction and awards correct reads.'},
  {id:'boss-round',group:'Auction',icon:'👑',name:'Boss Round',tag:'Final pick, double points',kind:'draft',priced:true,desc:'A premium final round can overturn the entire game.',rules:'Draft normally; every song’s catalogue value contributes to the dramatic finish.'},
  {id:'draft-royale',group:'Auction',icon:'🏝️',name:'Draft Royale',tag:'Survive the cuts',kind:'draft',knockout:true,desc:'Low-scoring lineups are eliminated throughout the draft.',rules:'After every two cycles, the lowest active collection leaves the competition.'}
);

const FALLBACK=[
  ['Levitating','Dua Lipa',2020],['Uptown Funk','Mark Ronson ft. Bruno Mars',2014],['Blinding Lights','The Weeknd',2019],['good 4 u','Olivia Rodrigo',2021],['As It Was','Harry Styles',2022],['Flowers','Miley Cyrus',2023],['Espresso','Sabrina Carpenter',2024],['Locked Out of Heaven','Bruno Mars',2012],['Houdini','Dua Lipa',2023],['Watermelon Sugar','Harry Styles',2019],['Bad Guy','Billie Eilish',2019],['Cruel Summer','Taylor Swift',2019]
].map(([name,artist,year],i)=>({name,artist,year,art:'',preview:'',cost:i%9+2}));

const $=selector=>document.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const shuffle=array=>{const copy=[...array];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy};
let selectedMode=null;
let arcadeState=null;
let countdownId=null;
let selectedArtists=[];

function showScreen(id){$$('.screen').forEach(screen=>screen.classList.toggle('hidden',screen.id!==id));scrollTo(0,0)}

function renderCatalogue(filter='All',search=''){
  const groups=['All',...new Set(MODES.map(mode=>mode.group))];
  $('#arcadeFilters').innerHTML=groups.map(group=>`<button type="button" class="${group===filter?'active':''}" data-filter="${group}">${group}</button>`).join('');
  const query=search.trim().toLowerCase();
  const visible=MODES.filter(mode=>(filter==='All'||mode.group===filter)&&(!query||`${mode.name} ${mode.desc} ${mode.tag} ${mode.group}`.toLowerCase().includes(query)));
  $('#arcadeGrid').innerHTML=visible.map((mode,index)=>`<article class="arcade-card arcade-${mode.group.toLowerCase()}" style="--delay:${index*25}ms"><div class="arcade-card-top"><span class="arcade-icon">${mode.icon}</span><span class="arcade-group">${mode.group}</span></div><h3>${escapeHtml(mode.name)}</h3><b>${escapeHtml(mode.tag)}</b><p>${escapeHtml(mode.desc)}</p><button type="button" data-mode="${mode.id}">Play mode <span>→</span></button></article>`).join('')||'<div class="arcade-empty"><h3>No games found</h3><p>Try another search or category.</p></div>';
  $$('#arcadeFilters button').forEach(button=>button.onclick=()=>renderCatalogue(button.dataset.filter,$('#arcadeSearch').value));
  $$('#arcadeGrid [data-mode]').forEach(button=>button.onclick=()=>openSetup(button.dataset.mode));
}

function openSetup(id){
  selectedMode=MODES.find(mode=>mode.id===id);
  if(!selectedMode)return;
  showScreen('arcadeSetup');
  history.pushState({},'',new URL(`?page=arcade&mode=${id}`,location.href));
  $('#arcadeModeIntro').innerHTML=`<div class="arcade-intro-icon">${selectedMode.icon}</div><p class="eyebrow">${selectedMode.group.toUpperCase()} MODE</p><h2>${escapeHtml(selectedMode.name)}</h2><p>${escapeHtml(selectedMode.rules)}</p>`;
  const min=selectedMode.min||2,max=selectedMode.max||8;
  $('#arcadePlayers').innerHTML='';
  const signedInName=$('#accountLabel')?.textContent?.trim();
  for(let i=1;i<=min;i++)addPlayer(i===1&&signedInName&&signedInName!=='Account'?signedInName:`Player ${i}`);
  $('#arcadeAddPlayer').classList.toggle('hidden',min===max);
  $('#arcadeAddPlayer').dataset.max=String(max);
  $('#arcadeRounds').value=selectedMode.rounds||(['draft','submission'].includes(selectedMode.kind)?4:5);
  $('#arcadeRounds').disabled=Boolean(selectedMode.daily);
  $('#arcadeSetupNotice').textContent='';
  selectedArtists=[{name:'Bruno Mars',id:'278873078'},{name:'Dua Lipa',id:'1031397873'}];renderSelectedArtists();$('#arcadeArtistSearch').value='';$('#arcadeArtistSearch').disabled=Boolean(selectedMode.daily);$$('#arcadeArtistChips button').forEach(button=>button.disabled=Boolean(selectedMode.daily));
}

function addPlayer(name=''){
  const list=$('#arcadePlayers'),max=Number($('#arcadeAddPlayer').dataset.max||8);
  if(list.children.length>=max)return;
  const row=document.createElement('div');
  row.className='arcade-player-row';
  row.innerHTML=`<input maxlength="20" value="${escapeHtml(name||`Player ${list.children.length+1}`)}" aria-label="Player ${list.children.length+1} name"><button type="button" aria-label="Remove player">×</button>`;
  row.querySelector('button').onclick=()=>{if(list.children.length>(selectedMode?.min||2))row.remove()};
  list.append(row);
}

function addSelectedArtist(artist){
  if(!artist?.name||selectedArtists.some(item=>String(item.id)&&String(item.id)===String(artist.id)))return;
  selectedArtists.push({name:artist.name,id:String(artist.id||'')});selectedArtists=selectedArtists.slice(0,8);renderSelectedArtists();$('#arcadeArtistSearch').value='';
}
function renderSelectedArtists(){
  $('#arcadeArtistChips').innerHTML=selectedArtists.map((artist,index)=>`<span>${escapeHtml(artist.name)}<button type="button" data-index="${index}" aria-label="Remove ${escapeHtml(artist.name)}">×</button></span>`).join('');
  $$('#arcadeArtistChips button').forEach(button=>button.onclick=()=>{selectedArtists.splice(Number(button.dataset.index),1);renderSelectedArtists()});
}

async function fetchSongs(artists){
  if(!artists.length)return FALLBACK;
  try{
    const batches=await Promise.all(artists.slice(0,8).map(artist=>window.ArtistPicker.tracks(artist,150)));
    const unique=[...new Map(batches.flat().map((song,index)=>[`${song.name}|${song.artistId}`.toLowerCase(),{...song,artist:song.artist||song.sub,cost:(index%9)+2}])).values()];
    return unique.length>=8?unique:FALLBACK;
  }catch{return FALLBACK}
}

async function startGame(){
  const names=$$('#arcadePlayers input').map(input=>input.value.trim()).filter(Boolean),min=selectedMode.min||2,max=selectedMode.max||8;
  if(names.length<min||names.length>max)return $('#arcadeSetupNotice').textContent=`This mode needs ${min===max?min:`${min}–${max}`} players.`;
  $('#arcadeStart').disabled=true;$('#arcadeStart').textContent='Loading the music…';
  const pending=$('#arcadeArtistSearch').value.trim();if(pending&&!selectedArtists.some(x=>window.ArtistPicker.normal(x.name)===window.ArtistPicker.normal(pending)))selectedArtists.push({name:pending,id:''});
  const loadedSongs=await fetchSongs(selectedArtists),playableSongs=['intro','name','beat','estimate'].includes(selectedMode.kind)&&loadedSongs.some(song=>song.preview)?loadedSongs.filter(song=>song.preview):loadedSongs,songs=selectedMode.daily?[...playableSongs].sort((a,b)=>`${a.name}|${a.artist}`.localeCompare(`${b.name}|${b.artist}`)):shuffle(playableSongs);
  const rounds=Math.max(1,Math.min(12,Number($('#arcadeRounds').value)||5));
  arcadeState={mode:selectedMode,players:names.map((name,index)=>({name,score:0,picks:[],budget:selectedMode.allin?20:30,power:true,active:true,team:index%2})),songs,available:songs.slice(0,Math.min(songs.length,Math.max(12,names.length*rounds+4))),rounds,round:0,turn:0,direction:1,submissions:[],submitIndex:0,taps:[],roleIndex:0,impostor:Math.floor(Math.random()*names.length),secret:songs[0],timer:null,introStep:0,introGuesses:[],pattern:[],patternLevel:3,textEntries:[],textIndex:0};
  $('#arcadeStart').disabled=false;$('#arcadeStart').textContent='Load songs & start';
  showScreen('arcadePlay');
  renderArcade();
}

function renderScores(){
  $('#arcadeScores').innerHTML=arcadeState.players.map((player,index)=>`<article class="${index===currentPlayerIndex()?'current':''} ${!player.active?'out':''}"><span>${arcadeState.mode.teams?`Team ${player.team?'Lime':'Purple'} · `:''}${escapeHtml(player.name)}</span><b>${player.score} pts${arcadeState.mode.priced?` · $${player.budget}`:''}</b></article>`).join('');
  $('#arcadeModeName').textContent=arcadeState.mode.name;
  $('#arcadeRoundLabel').textContent=`Round ${Math.min(arcadeState.round+1,arcadeState.rounds)} of ${arcadeState.rounds}`;
}

function currentPlayerIndex(){
  const active=arcadeState.players.map((p,i)=>p.active?i:null).filter(i=>i!==null);
  if(!active.length)return 0;
  if(arcadeState.mode.snake){const cycle=Math.floor(arcadeState.turn/active.length),position=arcadeState.turn%active.length;return cycle%2?active[active.length-1-position]:active[position]}
  return active[arcadeState.turn%active.length];
}

function renderArcade(){
  clearInterval(countdownId);
  renderScores();
  const renderers={draft:renderDraft,mystery:renderMystery,name:renderNameSong,timeline:renderTimeline,beat:renderBeat,submission:renderSubmission,vote:renderVote,impostor:renderImpostor,intro:renderIntroGame,quiz:renderQuiz,order:renderOrder,higher:renderHigher,word:renderWordGame,bingo:renderBingo,pattern:renderPattern,text:renderTextParty,estimate:renderEstimate,reaction:renderReaction,drawing:renderDrawing};
  (renderers[arcadeState.mode.kind]||renderDraft)();
}

function slotLabel(){const slots=arcadeState.mode.slots||[];return slots[arcadeState.round%slots.length]||''}
function songCard(song,index,action='Choose'){
  return`<button type="button" class="arcade-song" data-song="${index}">${song.art?`<img src="${escapeHtml(song.art)}" alt="">`:'<span class="song-placeholder">♪</span>'}<span><b>${escapeHtml(song.name)}</b><small>${escapeHtml(song.artist)}</small>${arcadeState.mode.priced?`<strong>$${song.cost}</strong>`:''}</span><em>${action}</em></button>`
}

function renderDraft(){
  if(arcadeState.turn>=arcadeState.rounds*arcadeState.players.length||!arcadeState.available.length)return finishArcade();
  const playerIndex=currentPlayerIndex(),player=arcadeState.players[playerIndex],slot=slotLabel(),stealTurn=arcadeState.mode.steal&&arcadeState.turn>=arcadeState.players.length&&arcadeState.turn%arcadeState.players.length===0;
  if((arcadeState.mode.priced&&player.budget<=0)||!player.active){arcadeState.turn++;return renderArcade()}
  const visible=arcadeState.available.slice(0,9);
  $('#arcadeStage').innerHTML=`<section class="arcade-prompt"><p class="eyebrow">${slot?escapeHtml(slot):stealTurn?'STEAL ROUND':'YOUR PICK'}</p><h2>Pass to ${escapeHtml(player.name)}</h2><p>${arcadeState.mode.teams?`You’re drafting for Team ${player.team?'Lime':'Purple'}.`:arcadeState.mode.priced?`You have $${player.budget} remaining.`:'Choose one song for your lineup.'}</p>${arcadeState.mode.sabotage&&player.power?'<button id="useSabotage" class="danger-mini">Use sabotage power</button>':''}</section><div class="arcade-song-grid">${visible.map((song,index)=>songCard(song,index)).join('')}</div>${stealTurn?renderStealChoices(playerIndex):''}<p id="arcadeActionNotice" class="error"></p>`;
  $$('.arcade-song',$('#arcadeStage')).forEach(button=>button.onclick=()=>chooseDraftSong(playerIndex,Number(button.dataset.song)));
  $$('.steal-pick',$('#arcadeStage')).forEach(button=>button.onclick=()=>stealPick(playerIndex,Number(button.dataset.owner),Number(button.dataset.pick)));
  const sabotage=$('#useSabotage');if(sabotage)sabotage.onclick=()=>{player.power=false;arcadeState.available.splice(0,1);renderArcade()};
  if(arcadeState.mode.timer)startCountdown(arcadeState.mode.timer,()=>{arcadeState.turn++;renderArcade()});
}

function renderStealChoices(playerIndex){
  const choices=arcadeState.players.flatMap((player,owner)=>owner===playerIndex?[]:player.picks.map((pick,index)=>({pick,owner,index})));
  if(!choices.length)return'';
  return`<section class="steal-tray"><h3>Or steal a rival pick</h3>${choices.slice(0,6).map(x=>`<button class="steal-pick" data-owner="${x.owner}" data-pick="${x.index}">${escapeHtml(x.pick.name)} from ${escapeHtml(arcadeState.players[x.owner].name)}</button>`).join('')}</section>`
}

function chooseDraftSong(playerIndex,visibleIndex){
  clearInterval(countdownId);
  const player=arcadeState.players[playerIndex],song=arcadeState.available[visibleIndex];
  if(!song)return;
  if(arcadeState.mode.priced&&song.cost>player.budget){$('#arcadeActionNotice').textContent=`${player.name} only has $${player.budget}.`;return}
  arcadeState.available.splice(visibleIndex,1);player.picks.push({...song,slot:slotLabel()});player.score+=song.cost;
  if(arcadeState.mode.priced)player.budget-=song.cost;
  advanceDraft();
}

function stealPick(playerIndex,ownerIndex,pickIndex){
  const stolen=arcadeState.players[ownerIndex].picks.splice(pickIndex,1)[0];if(!stolen)return;
  arcadeState.players[playerIndex].picks.push(stolen);arcadeState.players[playerIndex].score+=stolen.cost;arcadeState.players[ownerIndex].score-=stolen.cost;advanceDraft();
}

function advanceDraft(){
  arcadeState.turn++;
  const cycle=Math.floor(arcadeState.turn/arcadeState.players.length);
  if(arcadeState.mode.knockout&&cycle>0&&cycle%2===0&&arcadeState.turn%arcadeState.players.length===0){const active=arcadeState.players.filter(p=>p.active);if(active.length>2){active.sort((a,b)=>a.score-b.score)[0].active=false}}
  arcadeState.round=Math.floor(arcadeState.turn/arcadeState.players.length);
  renderArcade();
}

function startCountdown(seconds,onEnd){
  const prompt=$('.arcade-prompt');if(!prompt)return;const badge=document.createElement('strong');badge.className='arcade-countdown';prompt.prepend(badge);let left=seconds;badge.textContent=left;
  countdownId=setInterval(()=>{left--;badge.textContent=left;if(left<=0){clearInterval(countdownId);onEnd()}},1000);
}

function renderMystery(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();
  const song=arcadeState.songs[arcadeState.round%arcadeState.songs.length],decade=Math.floor(song.year/10)*10;
  $('#arcadeStage').innerHTML=`<section class="mystery-card"><p class="eyebrow">MYSTERY SONG</p><h2 id="mysteryTitle">${decade}s release</h2><div id="mysteryClue"><span class="mystery-mark">?</span></div><button id="nextClue" class="primary">Reveal artwork clue</button><div id="awardMystery" class="hidden"><h3>Who guessed it first?</h3>${playerButtons('award-point')}</div></section>`;
  let clue=0;$('#nextClue').onclick=()=>{clue++;if(clue===1){$('#mysteryClue').innerHTML=song.art?`<img class="mystery-art" src="${escapeHtml(song.art)}" alt="Blurred album artwork">`:'<span class="mystery-mark">♪</span>';$('#nextClue').textContent='Reveal artist'}else if(clue===2){$('#mysteryTitle').textContent=song.artist;$('#nextClue').textContent='Reveal answer'}else{$('#mysteryTitle').textContent=song.name;$('#mysteryClue').classList.add('revealed');$('#nextClue').classList.add('hidden');$('#awardMystery').classList.remove('hidden');bindAwardButtons()}};
}

function renderNameSong(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();
  const song=arcadeState.songs[arcadeState.round%arcadeState.songs.length];
  $('#arcadeStage').innerHTML=`<section class="guess-card"><p class="eyebrow">NAME THAT SONG</p><div class="vinyl">♪</div><h2 id="guessAnswer">Mystery track</h2><p id="guessArtist">Call out the title as soon as you know it.</p>${song.preview?`<audio controls autoplay src="${escapeHtml(song.preview)}"></audio>`:'<p class="error">This track has no preview—use the artwork clue instead.</p>'}<button id="revealSong" class="primary">Reveal answer</button><div id="nameAwards" class="hidden"><h3>Who got it first?</h3>${playerButtons('award-point')}</div></section>`;
  $('#revealSong').onclick=()=>{$('#guessAnswer').textContent=song.name;$('#guessArtist').textContent=song.artist;$('#revealSong').classList.add('hidden');$('#nameAwards').classList.remove('hidden');bindAwardButtons()};
}

function renderTimeline(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();
  const playerIndex=arcadeState.round%arcadeState.players.length,player=arcadeState.players[playerIndex],song=arcadeState.songs[arcadeState.round%arcadeState.songs.length],year=song.year||2000;
  const options=shuffle([year,year-1-Math.floor(Math.random()*3),year+1+Math.floor(Math.random()*3),year-5-Math.floor(Math.random()*4)]);
  $('#arcadeStage').innerHTML=`<section class="timeline-card"><p class="eyebrow">${escapeHtml(player.name)}’S TURN</p>${song.art?`<img src="${escapeHtml(song.art)}" alt="">`:''}<h2>${escapeHtml(song.name)}</h2><p>${escapeHtml(song.artist)}</p><h3>What year was it released?</h3><div class="year-grid">${options.map(option=>`<button data-year="${option}">${option}</button>`).join('')}</div><p id="timelineResult"></p></section>`;
  $$('.year-grid button').forEach(button=>button.onclick=()=>{const correct=Number(button.dataset.year)===year;if(correct)player.score++;$$('.year-grid button').forEach(x=>{x.disabled=true;x.classList.toggle('correct',Number(x.dataset.year)===year)});$('#timelineResult').className=correct?'success':'error';$('#timelineResult').innerHTML=`${correct?'Correct!':'Not quite.'} It was ${year}. <button id="nextTimeline">Next song →</button>`;$('#nextTimeline').onclick=()=>{arcadeState.round++;renderArcade()}})
}

function renderBeat(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();
  const player=arcadeState.players[arcadeState.round%arcadeState.players.length],song=arcadeState.songs[arcadeState.round%arcadeState.songs.length],target=80+(hash(song.name)%81);arcadeState.taps=[];
  $('#arcadeStage').innerHTML=`<section class="beat-card"><p class="eyebrow">${escapeHtml(player.name)} · RHYTHM ROUND</p><h2>Find the pulse</h2><p>${escapeHtml(song.name)} · ${escapeHtml(song.artist)}</p>${song.preview?`<audio controls src="${escapeHtml(song.preview)}"></audio>`:''}<button id="tapBeat" class="tap-button">TAP</button><p id="tapCount">0 / 8 taps</p><p class="muted">Aim for a steady tempo. Bluetooth audio delay does not affect the spacing score.</p></section>`;
  $('#tapBeat').onclick=()=>{arcadeState.taps.push(Date.now());$('#tapCount').textContent=`${arcadeState.taps.length} / 8 taps`;if(arcadeState.taps.length===8)scoreBeat(player,target)};
}

function scoreBeat(player,target){
  const intervals=arcadeState.taps.slice(1).map((tap,index)=>tap-arcadeState.taps[index]),average=intervals.reduce((a,b)=>a+b,0)/intervals.length,bpm=60000/average,variance=intervals.reduce((sum,value)=>sum+Math.abs(value-average),0)/intervals.length,accuracy=Math.max(0,Math.round(100-Math.abs(bpm-target)*1.2-variance/8));player.score+=Math.round(accuracy/10);
  $('.beat-card').innerHTML+=`<div class="beat-result"><strong>${accuracy}%</strong><p>Your tempo: ${Math.round(bpm)} BPM · target: ${target} BPM</p><button id="nextBeat" class="primary">Next player</button></div>`;$('#tapBeat').disabled=true;$('#nextBeat').onclick=()=>{arcadeState.round++;renderArcade()};
}

function renderSubmission(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();
  const prompts=arcadeState.mode.prompts,player=arcadeState.players[arcadeState.submitIndex],prompt=prompts[arcadeState.round%prompts.length];
  if(arcadeState.submitIndex>=arcadeState.players.length)return revealSubmissions(prompt);
  $('#arcadeStage').innerHTML=`<section class="arcade-prompt"><p class="eyebrow">${escapeHtml(prompt)}</p><h2>Pass to ${escapeHtml(player.name)}</h2><p>Choose privately. Your name stays hidden until voting ends.</p></section><div class="arcade-song-grid">${arcadeState.songs.slice(0,12).map((song,index)=>songCard(song,index,'Submit')).join('')}</div>`;
  $$('.arcade-song').forEach(button=>button.onclick=()=>{arcadeState.submissions.push({player:arcadeState.submitIndex,song:arcadeState.songs[Number(button.dataset.song)]});arcadeState.submitIndex++;renderSubmission()});
}

function revealSubmissions(prompt){
  $('#arcadeStage').innerHTML=`<section class="arcade-prompt"><p class="eyebrow">VOTE · ${escapeHtml(prompt)}</p><h2>Which choice wins?</h2><p>Listen, debate, then tap one submission. You cannot vote twice on this device.</p></section><div class="submission-grid">${shuffle(arcadeState.submissions).map((entry,index)=>`<article><span>Submission ${index+1}</span>${entry.song.art?`<img src="${escapeHtml(entry.song.art)}" alt="">`:''}<h3>${escapeHtml(entry.song.name)}</h3><p>${escapeHtml(entry.song.artist)}</p>${entry.song.preview?`<audio controls src="${escapeHtml(entry.song.preview)}"></audio>`:''}<button data-player="${entry.player}">Vote for this</button></article>`).join('')}</div>`;
  $$('.submission-grid button').forEach(button=>button.onclick=()=>{const winner=arcadeState.players[Number(button.dataset.player)];winner.score+=2;$('#arcadeStage').innerHTML=`<section class="round-winner"><span>🏆</span><p class="eyebrow">ROUND WINNER</p><h2>${escapeHtml(winner.name)}</h2><button id="nextSubmission" class="primary">Next prompt</button></section>`;$('#nextSubmission').onclick=()=>{arcadeState.round++;arcadeState.submitIndex=0;arcadeState.submissions=[];renderArcade()}})
}

function renderVote(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const prompt=arcadeState.mode.prompts[arcadeState.round%arcadeState.mode.prompts.length];
  $('#arcadeStage').innerHTML=`<section class="vote-card"><p class="eyebrow">PREDICTION ${arcadeState.round+1}</p><h2>${escapeHtml(prompt)}</h2><p>Discuss, then choose the room’s answer.</p><div class="player-vote-grid">${playerButtons('vote-player')}</div></section>`;bindAwardButtons();
}

function renderImpostor(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();
  if(arcadeState.roleIndex<arcadeState.players.length){const player=arcadeState.players[arcadeState.roleIndex],isImpostor=arcadeState.roleIndex===arcadeState.impostor;$('#arcadeStage').innerHTML=`<section class="role-card"><p class="eyebrow">PRIVATE ROLE</p><h2>Pass to ${escapeHtml(player.name)}</h2><div id="privateRole" class="hidden"><span>${isImpostor?'🕵️':'🎵'}</span><h3>${isImpostor?'You are the impostor':escapeHtml(arcadeState.secret.name)}</h3><p>${isImpostor?`Your only clue: ${escapeHtml(arcadeState.secret.artist)}`:`Artist: ${escapeHtml(arcadeState.secret.artist)}`}</p><button id="hideRole" class="primary">Hide & pass</button></div><button id="showRole" class="primary">Show my role</button></section>`;$('#showRole').onclick=()=>{$('#showRole').classList.add('hidden');$('#privateRole').classList.remove('hidden')};$('#hideRole').onclick=()=>{arcadeState.roleIndex++;renderImpostor()};return}
  $('#arcadeStage').innerHTML=`<section class="vote-card"><p class="eyebrow">DISCUSS, THEN VOTE</p><h2>Who is the music impostor?</h2><div class="player-vote-grid">${playerButtons('impostor-vote')}</div></section>`;
  $$('.impostor-vote').forEach(button=>button.onclick=()=>{const guess=Number(button.dataset.player),caught=guess===arcadeState.impostor;if(caught)arcadeState.players.forEach((p,i)=>{if(i!==arcadeState.impostor)p.score++});else arcadeState.players[arcadeState.impostor].score+=2;$('#arcadeStage').innerHTML=`<section class="round-winner"><span>${caught?'✅':'🕵️'}</span><p class="eyebrow">${caught?'IMPOSTOR CAUGHT':'IMPOSTOR ESCAPED'}</p><h2>${escapeHtml(arcadeState.players[arcadeState.impostor].name)}</h2><p>The secret song was ${escapeHtml(arcadeState.secret.name)}.</p><button id="nextImpostor" class="primary">Next round</button></section>`;$('#nextImpostor').onclick=()=>{arcadeState.round++;arcadeState.roleIndex=0;arcadeState.impostor=Math.floor(Math.random()*arcadeState.players.length);arcadeState.secret=arcadeState.songs[arcadeState.round%arcadeState.songs.length];renderArcade()}})
}

const normalizeAnswer=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\([^)]*\)|\[[^\]]*\]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const introLengths=[.5,1,2,4,8,16];
function introSong(){if(!arcadeState.mode.daily)return arcadeState.songs[arcadeState.round%arcadeState.songs.length];const day=new Date().toISOString().slice(0,10),index=hash(`${day}|${arcadeState.mode.id}`)%arcadeState.songs.length;return arcadeState.songs[index]}
let reverseAudioContext=null;
async function playIntroClip(song,seconds){
  const notice=$('#introAudioNotice');if(!song.preview){if(notice)notice.textContent='This catalogue entry has no playable preview. Skip to another round.';return}
  if(arcadeState.mode.audioEffect==='reverse')try{reverseAudioContext??=new (window.AudioContext||window.webkitAudioContext)();const response=await fetch(song.preview),decoded=await reverseAudioContext.decodeAudioData(await response.arrayBuffer()),frames=Math.min(decoded.length,Math.max(1,Math.floor(seconds*decoded.sampleRate))),reversed=reverseAudioContext.createBuffer(decoded.numberOfChannels,frames,decoded.sampleRate);for(let channel=0;channel<decoded.numberOfChannels;channel++){const input=decoded.getChannelData(channel),output=reversed.getChannelData(channel);for(let i=0;i<frames;i++)output[i]=input[frames-1-i]}const source=reverseAudioContext.createBufferSource();source.buffer=reversed;source.connect(reverseAudioContext.destination);source.start();return}catch{if(notice)notice.textContent='Reverse processing is unavailable for this preview, so the normal opening will play.'}
  const audio=new Audio(song.preview);audio.preload='auto';audio.currentTime=0;if(arcadeState.mode.audioEffect==='speed')audio.playbackRate=arcadeState.round%2?1.35:.72;
  audio.play().then(()=>setTimeout(()=>{audio.pause();audio.currentTime=0},seconds*1000)).catch(()=>{if(notice)notice.textContent='Press play again—the browser blocked automatic audio.'});
}
function renderIntroGame(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();
  const song=introSong(),player=arcadeState.players[arcadeState.round%arcadeState.players.length],step=Math.min(arcadeState.introStep,5),seconds=introLengths[step],effect=arcadeState.mode.audioEffect==='reverse'?'reversed-style challenge':arcadeState.mode.audioEffect==='speed'?'altered-speed preview':'opening preview';
  const options=[song,...arcadeState.songs].filter((item,index,array)=>array.findIndex(other=>other.name===item.name&&other.artist===item.artist)===index).slice(0,150).map(item=>`${item.name} — ${item.artist}`);
  $('#arcadeStage').innerHTML=`<section class="intro-game"><p class="eyebrow">${arcadeState.mode.daily?'TODAY’S SONG':`${escapeHtml(player.name)} · ROUND ${arcadeState.round+1}`}</p><div class="intro-disc">${seconds}s</div><h2>Recognise the ${effect}</h2><div class="intro-progress">${introLengths.map((length,index)=>`<span class="${index<step?'miss':index===step?'current':''}">${length}s</span>`).join('')}</div><button id="playIntro" class="primary">▶ Play from the beginning</button><p id="introAudioNotice" class="muted">Every replay begins at 0:00 of the available catalogue preview.</p><form id="introGuessForm"><label>Your guess<input id="introGuess" list="introSongOptions" autocomplete="off" placeholder="Search song or artist" required></label><datalist id="introSongOptions">${options.map(option=>`<option value="${escapeHtml(option)}">`).join('')}</datalist><div class="intro-actions"><button class="primary" type="submit">Submit guess</button><button id="skipIntro" type="button">Skip</button></div></form><div class="intro-history">${arcadeState.introGuesses.map(guess=>`<p>✕ ${escapeHtml(guess)}</p>`).join('')}</div><p id="introResult" aria-live="polite"></p></section>`;
  $('#playIntro').onclick=()=>playIntroClip(song,seconds);$('#skipIntro').onclick=()=>submitIntroGuess('',true);$('#introGuessForm').onsubmit=event=>{event.preventDefault();submitIntroGuess($('#introGuess').value,false)};
}
function submitIntroGuess(value,skipped){
  const song=introSong(),guess=value.trim(),accepted=[song.name,`${song.name} — ${song.artist}`,`${song.name} - ${song.artist}`].some(answer=>normalizeAnswer(answer)===normalizeAnswer(guess));
  if(accepted){const player=arcadeState.players[arcadeState.round%arcadeState.players.length],points=6-arcadeState.introStep;player.score+=points;if(arcadeState.mode.daily)saveDailyIntro(true,points);return showIntroResult(song,true,points)}
  if(!skipped&&arcadeState.introGuesses.some(old=>normalizeAnswer(old)===normalizeAnswer(guess)))return $('#introResult').textContent='You already tried that answer.';
  arcadeState.introGuesses.push(skipped?'Skipped':guess);arcadeState.introStep++;
  if(arcadeState.introStep>=6){if(arcadeState.mode.daily)saveDailyIntro(false,0);return showIntroResult(song,false,0)}renderIntroGame();
}
function showIntroResult(song,won,points){
  const grid=introLengths.map((_,index)=>index<arcadeState.introStep?'🟥':index===arcadeState.introStep&&won?'🟩':'⬛').join('');
  $('#arcadeStage').innerHTML=`<section class="round-winner intro-reveal">${song.art?`<img src="${escapeHtml(song.art)}" alt="">`:'<span>🎵</span>'}<p class="eyebrow">${won?`SOLVED · +${points} POINTS`:'ANSWER REVEALED'}</p><h2>${escapeHtml(song.name)}</h2><p>${escapeHtml(song.artist)}</p><div class="share-grid">${grid}</div><div class="final-actions"><button id="shareIntro" class="smallbtn">Share result</button><button id="nextIntro" class="primary">${arcadeState.round+1>=arcadeState.rounds?'See results':'Next song'}</button></div></section>`;
  $('#shareIntro').onclick=async()=>{const text=`${arcadeState.mode.name} ${won?arcadeState.introStep+1:'X'}/6\n${grid}`;if(navigator.share)await navigator.share({title:arcadeState.mode.name,text}).catch(()=>{});else await navigator.clipboard?.writeText(text)};
  $('#nextIntro').onclick=()=>{arcadeState.round++;arcadeState.introStep=0;arcadeState.introGuesses=[];renderArcade()};
}
function saveDailyIntro(won,points){const key='draftDuelSonglessDaily',today=new Date().toISOString().slice(0,10),data=JSON.parse(localStorage.getItem(key)||'{}'),yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);if(data.last===today)return;data.games=(data.games||0)+1;data.wins=(data.wins||0)+(won?1:0);data.streak=won?(data.last===yesterday?(data.streak||0)+1:1):0;data.best=Math.max(data.best||0,data.streak||0);data.last=today;data.points=(data.points||0)+points;localStorage.setItem(key,JSON.stringify(data))}

function quizChoices(song,count=4){return shuffle([song,...shuffle(arcadeState.songs.filter(item=>item.name!==song.name)).slice(0,count-1)])}
function renderQuiz(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const mode=arcadeState.mode,player=arcadeState.players[arcadeState.round%arcadeState.players.length],song=arcadeState.songs[arcadeState.round%arcadeState.songs.length],choices=quizChoices(song);let prompt='Which song is this?',clue='',correct=song.name;
  if(mode.quiz==='cover'){prompt='Which song uses this artwork?';clue=song.art?`<img class="quiz-cover" src="${escapeHtml(song.art)}" alt="Pixelated album artwork">`:''}
  if(mode.quiz==='title'){prompt='Complete the hidden song title';clue=`<div class="title-mask">${escapeHtml(song.name.replace(/[aeiou]/gi,'_'))}</div>`}
  if(mode.quiz==='odd'){const base=song.artist;prompt='Which song is by a different artist?';const same=arcadeState.songs.filter(item=>item.artist===base&&item.name!==song.name).slice(0,3),outsider=arcadeState.songs.find(item=>item.artist!==base)||song;choices.splice(0,choices.length,...shuffle([...same,outsider]).slice(0,4));correct=outsider.name;clue=`<p>Three choices are by <b>${escapeHtml(base)}</b>.</p>`}
  if(mode.quiz==='year'){const pair=choices.slice(0,2).sort((a,b)=>(a.year||9999)-(b.year||9999));prompt='Which song was released first?';choices.splice(0,choices.length,...pair);correct=pair[0].name}
  if(mode.quiz==='theme'){prompt='What connects this playlist?';const related=arcadeState.songs.filter(item=>item.artist===song.artist).slice(0,3),themed=related.length>=3?related:arcadeState.songs.filter(item=>Math.floor((item.year||0)/10)===Math.floor((song.year||0)/10)).slice(0,3);clue=`<p>${themed.map(item=>escapeHtml(item.name)).join(' · ')}</p>`;correct=related.length>=3?`Songs connected to ${song.artist}`:`Songs from the ${Math.floor((song.year||2000)/10)*10}s`;choices.splice(0,choices.length,{name:correct},{name:'Songs with one-word titles'},{name:'Songs by the same producer'},{name:'There is no connection'})}
  if(mode.quiz==='review'){prompt='Which song fits this terrible review?';clue=`<blockquote>“${escapeHtml(song.name)} but described with absolutely no musical context.”</blockquote>`}
  if(mode.quiz==='emoji'){prompt='Decode the song';clue=`<div class="emoji-clue">${['🌙✨','💔🚗','🔥💃','🌊❤️'][hash(song.name)%4]}</div>`}
  if(mode.quiz==='tempo'){prompt='What happened to the pulse?';choices.splice(0,choices.length,{name:'It sped up'},{name:'It slowed down'},{name:'It stayed steady'});correct=choices[hash(`${song.name}|tempo`)%3].name;clue='<p>Tap the pulse in your head, then trust your instinct.</p>'}
  $('#arcadeStage').innerHTML=`<section class="quiz-card"><p class="eyebrow">${escapeHtml(player.name)}’S QUESTION</p><h2>${escapeHtml(prompt)}</h2>${clue}<div class="quiz-options">${choices.map(item=>`<button data-answer="${escapeHtml(item.name)}">${escapeHtml(item.name)}${item.artist?`<small>${escapeHtml(item.artist)}</small>`:''}</button>`).join('')}</div><p id="quizResult"></p></section>`;
  $$('.quiz-options button').forEach(button=>button.onclick=()=>{const won=button.dataset.answer===correct;if(won)player.score++;$$('.quiz-options button').forEach(item=>{item.disabled=true;item.classList.toggle('correct',item.dataset.answer===correct)});$('#quizResult').innerHTML=`${won?'Correct!':'The answer is '+escapeHtml(correct)+'.'} <button id="nextQuiz" class="smallbtn">Next →</button>`;$('#nextQuiz').onclick=()=>{arcadeState.round++;renderArcade()}})
}

function renderOrder(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const player=arcadeState.players[arcadeState.round%arcadeState.players.length],items=shuffle(arcadeState.songs.filter(song=>song.year).slice(arcadeState.round,arcadeState.round+4));arcadeState.orderItems=arcadeState.orderItems?.length?arcadeState.orderItems:items;
  $('#arcadeStage').innerHTML=`<section class="order-card"><p class="eyebrow">${escapeHtml(player.name)}’S TURN</p><h2>Put these in release order</h2><p>Oldest at the top.</p><div id="orderList">${arcadeState.orderItems.map((song,index)=>`<div><span>${escapeHtml(song.name)}<small>${escapeHtml(song.artist)}</small></span><button data-move="up" data-index="${index}">↑</button><button data-move="down" data-index="${index}">↓</button></div>`).join('')}</div><button id="checkOrder" class="primary">Lock order</button></section>`;
  $$('#orderList button').forEach(button=>button.onclick=()=>{const i=Number(button.dataset.index),j=button.dataset.move==='up'?i-1:i+1;if(j<0||j>=arcadeState.orderItems.length)return;[arcadeState.orderItems[i],arcadeState.orderItems[j]]=[arcadeState.orderItems[j],arcadeState.orderItems[i]];renderOrder()});
  $('#checkOrder').onclick=()=>{const correct=[...arcadeState.orderItems].sort((a,b)=>a.year-b.year),won=correct.every((song,index)=>song===arcadeState.orderItems[index]);if(won)player.score+=2;$('#arcadeStage').innerHTML=`<section class="round-winner"><span>${won?'✅':'🗓️'}</span><h2>${won?'Perfect order!':'Correct timeline'}</h2><p>${correct.map(song=>`${escapeHtml(song.year)} · ${escapeHtml(song.name)}`).join('<br>')}</p><button id="nextOrder" class="primary">Next</button></section>`;$('#nextOrder').onclick=()=>{arcadeState.round++;arcadeState.orderItems=[];renderArcade()}}
}

function renderHigher(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const player=arcadeState.players[arcadeState.round%arcadeState.players.length],a=arcadeState.songs[(arcadeState.round*2)%arcadeState.songs.length],b=arcadeState.songs[(arcadeState.round*2+1)%arcadeState.songs.length],answer=(b.year||0)>=(a.year||0)?'newer':'older';
  $('#arcadeStage').innerHTML=`<section class="higher-card"><p class="eyebrow">${escapeHtml(player.name)}’S TURN</p><h2>${escapeHtml(b.name)}</h2><p>Was it released before or after <b>${escapeHtml(a.name)}</b> (${a.year})?</p><div class="higher-buttons"><button data-answer="older">Older</button><button data-answer="newer">Newer</button></div><p id="higherResult"></p></section>`;$$('.higher-buttons button').forEach(button=>button.onclick=()=>{const won=button.dataset.answer===answer;if(won)player.score++;$('#higherResult').innerHTML=`${won?'Correct!':'Not quite.'} ${escapeHtml(b.name)} was released in ${b.year}. <button id="nextHigher">Next</button>`;$$('.higher-buttons button').forEach(x=>x.disabled=true);$('#nextHigher').onclick=()=>{arcadeState.round++;renderArcade()}})
}

function renderWordGame(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const player=arcadeState.players[arcadeState.round%arcadeState.players.length],prompts=arcadeState.mode.prompts||['Name a valid song for this round'],prompt=prompts[arcadeState.round%prompts.length];
  $('#arcadeStage').innerHTML=`<section class="word-card"><p class="eyebrow">${escapeHtml(player.name)} · QUICK ANSWER</p><h2>${escapeHtml(prompt)}</h2>${arcadeState.mode.timer?`<strong id="wordTimer" class="word-timer">${arcadeState.mode.timer}</strong>`:''}<input id="wordAnswer" placeholder="Type the answer"><button id="lockWord" class="primary">Lock answer</button><div id="judgeWord" class="hidden"><p id="wordReveal"></p><button data-valid="yes">Room accepts it</button><button data-valid="no">Not valid</button></div></section>`;
  let left=arcadeState.mode.timer||0;if(left)countdownId=setInterval(()=>{left--;$('#wordTimer').textContent=left;if(left<=0){clearInterval(countdownId);$('#lockWord').click()}},1000);$('#lockWord').onclick=()=>{clearInterval(countdownId);$('#wordReveal').textContent=$('#wordAnswer').value.trim()||'No answer';$('#judgeWord').classList.remove('hidden');$('#lockWord').disabled=true};$$('#judgeWord button').forEach(button=>button.onclick=()=>{if(button.dataset.valid==='yes')player.score++;arcadeState.round++;renderArcade()})
}

function renderBingo(){
  const player=arcadeState.players[arcadeState.round%arcadeState.players.length];if(!arcadeState.bingoCard)arcadeState.bingoCard=shuffle(arcadeState.songs).slice(0,16).map(song=>({song,marked:false}));
  $('#arcadeStage').innerHTML=`<section class="bingo-card"><p class="eyebrow">${escapeHtml(player.name)}’S CARD</p><h2>Music Bingo</h2><p>Tap a square when its song, artist, or clue is called.</p><div class="bingo-grid">${arcadeState.bingoCard.map((cell,index)=>`<button class="${cell.marked?'marked':''}" data-cell="${index}">${escapeHtml(cell.song.name)}<small>${escapeHtml(cell.song.artist)}</small></button>`).join('')}</div><button id="callBingo" class="primary">BINGO!</button><button id="nextBingoPlayer">Pass card</button></section>`;$$('.bingo-grid button').forEach(button=>button.onclick=()=>{arcadeState.bingoCard[Number(button.dataset.cell)].marked=!arcadeState.bingoCard[Number(button.dataset.cell)].marked;renderBingo()});$('#callBingo').onclick=()=>{const m=arcadeState.bingoCard.map(x=>x.marked),lines=[0,1,2,3].some(r=>[0,1,2,3].every(c=>m[r*4+c])||[0,1,2,3].every(c=>m[c*4+r]))||[0,5,10,15].every(i=>m[i])||[3,6,9,12].every(i=>m[i]);if(lines){player.score+=3;finishArcade()}else alert('No complete line yet.')};$('#nextBingoPlayer').onclick=()=>{arcadeState.round=(arcadeState.round+1)%arcadeState.players.length;arcadeState.bingoCard=null;renderBingo()}
}

function renderPattern(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const player=arcadeState.players[arcadeState.round%arcadeState.players.length],colours=['purple','lime','pink','blue'];if(!arcadeState.pattern.length)arcadeState.pattern=Array.from({length:arcadeState.patternLevel},()=>Math.floor(Math.random()*4));arcadeState.patternInput=[];
  $('#arcadeStage').innerHTML=`<section class="pattern-card"><p class="eyebrow">${escapeHtml(player.name)} · LEVEL ${arcadeState.patternLevel-2}</p><h2>Copy the rhythm</h2><div class="pattern-pads">${colours.map((colour,index)=>`<button class="${colour}" data-pad="${index}" disabled>${index+1}</button>`).join('')}</div><button id="showPattern" class="primary">Show pattern</button><p id="patternStatus">Watch, then repeat.</p></section>`;
  $('#showPattern').onclick=async()=>{const pads=$$('.pattern-pads button');$('#showPattern').disabled=true;for(const step of arcadeState.pattern){pads[step].classList.add('lit');await new Promise(resolve=>setTimeout(resolve,320));pads[step].classList.remove('lit');await new Promise(resolve=>setTimeout(resolve,130))}pads.forEach(pad=>pad.disabled=false)};
  $$('.pattern-pads button').forEach(button=>button.onclick=()=>{const step=Number(button.dataset.pad),index=arcadeState.patternInput.length;arcadeState.patternInput.push(step);if(step!==arcadeState.pattern[index])return patternEnd(false);if(arcadeState.patternInput.length===arcadeState.pattern.length)patternEnd(true)});
  function patternEnd(won){if(won)player.score+=arcadeState.patternLevel;$('#patternStatus').innerHTML=`${won?'Perfect pattern!':'Pattern broken.'} <button id="nextPattern" class="smallbtn">Next</button>`;$$('.pattern-pads button').forEach(x=>x.disabled=true);$('#nextPattern').onclick=()=>{arcadeState.round++;arcadeState.patternLevel=Math.min(8,arcadeState.patternLevel+(won?1:0));arcadeState.pattern=[];renderArcade()}}
}

function renderTextParty(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const mode=arcadeState.mode,song=arcadeState.songs[arcadeState.round%arcadeState.songs.length];
  if(arcadeState.textIndex<arcadeState.players.length){const player=arcadeState.players[arcadeState.textIndex];$('#arcadeStage').innerHTML=`<section class="text-party-card"><p class="eyebrow">PRIVATE ENTRY</p><h2>Pass to ${escapeHtml(player.name)}</h2>${mode.id==='caption-clash'&&song.art?`<img src="${escapeHtml(song.art)}" alt="Album cover">`:''}<p>${escapeHtml(mode.prompt||'Write your answer.')}</p><textarea id="textPartyAnswer" maxlength="160" placeholder="Your secret answer"></textarea><button id="submitTextParty" class="primary">Hide & pass</button></section>`;$('#submitTextParty').onclick=()=>{const text=$('#textPartyAnswer').value.trim();if(!text)return;arcadeState.textEntries.push({player:arcadeState.textIndex,text});arcadeState.textIndex++;renderTextParty()};return}
  const fakeMode=mode.id==='fake-track',entries=shuffle([...arcadeState.textEntries,...(fakeMode?[{player:-1,text:song.name,real:true}]:[])]);$('#arcadeStage').innerHTML=`<section class="arcade-prompt"><p class="eyebrow">ANONYMOUS REVEAL</p><h2>${fakeMode?'Which title is real?':'Vote for your favourite'}</h2></section><div class="text-entry-grid">${entries.map((entry,index)=>`<button data-player="${entry.player}" data-real="${entry.real?'yes':'no'}"><span>${index+1}</span><p>${escapeHtml(entry.text)}</p></button>`).join('')}</div>`;$$('.text-entry-grid button').forEach(button=>button.onclick=()=>{if(fakeMode&&button.dataset.real==='yes')arcadeState.players.forEach(player=>player.score++);else if(Number(button.dataset.player)>=0)arcadeState.players[Number(button.dataset.player)].score+=2;$('#arcadeStage').innerHTML=`<section class="round-winner"><span>${fakeMode&&button.dataset.real==='yes'?'✅':'🏆'}</span><h2>${fakeMode?`The real track was ${escapeHtml(song.name)}`:'Vote locked in'}</h2><button id="nextTextParty" class="primary">Next round</button></section>`;$('#nextTextParty').onclick=()=>{arcadeState.round++;arcadeState.textIndex=0;arcadeState.textEntries=[];renderArcade()}})
}

function renderEstimate(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const song=arcadeState.songs[arcadeState.round%arcadeState.songs.length],target=arcadeState.mode.estimate==='bpm'?80+(hash(song.name)%81):song.year||2000,player=arcadeState.players[arcadeState.submitIndex];
  if(arcadeState.submitIndex>=arcadeState.players.length){const closest=[...arcadeState.submissions].sort((a,b)=>Math.abs(a.value-target)-Math.abs(b.value-target))[0];arcadeState.players[closest.player].score+=2;$('#arcadeStage').innerHTML=`<section class="round-winner"><span>🎯</span><p class="eyebrow">CLOSEST GUESS</p><h2>${escapeHtml(arcadeState.players[closest.player].name)}</h2><p>The answer was ${target}${arcadeState.mode.estimate==='bpm'?' BPM':''}.</p><button id="nextEstimate" class="primary">Next round</button></section>`;$('#nextEstimate').onclick=()=>{arcadeState.round++;arcadeState.submitIndex=0;arcadeState.submissions=[];renderArcade()};return}
  $('#arcadeStage').innerHTML=`<section class="estimate-card"><p class="eyebrow">PASS TO ${escapeHtml(player.name)}</p><h2>${arcadeState.mode.estimate==='bpm'?'Estimate the BPM':'Estimate the release year'}</h2><p>${escapeHtml(song.name)} · ${escapeHtml(song.artist)}</p>${song.preview?`<audio controls src="${escapeHtml(song.preview)}"></audio>`:''}<input id="estimateValue" type="number" placeholder="Your estimate"><button id="submitEstimate" class="primary">Lock privately</button></section>`;$('#submitEstimate').onclick=()=>{const value=Number($('#estimateValue').value);if(!Number.isFinite(value))return;arcadeState.submissions.push({player:arcadeState.submitIndex,value});arcadeState.submitIndex++;renderEstimate()}
}

function renderReaction(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const player=arcadeState.players[arcadeState.round%arcadeState.players.length],stopMode=arcadeState.mode.id==='stop-beat';
  $('#arcadeStage').innerHTML=`<section class="reaction-card"><p class="eyebrow">${escapeHtml(player.name)}’S TURN</p><h2>${stopMode?'Stop at exactly 3 seconds':'Wait for green'}</h2><button id="reactionButton" class="reaction-button">${stopMode?'START':'WAIT…'}</button><p id="reactionResult"></p></section>`;const button=$('#reactionButton');let started=0,ready=false,timer;
  if(stopMode)button.onclick=()=>{if(!started){started=performance.now();button.textContent='STOP';button.classList.add('ready')}else finish(Math.abs(performance.now()-started-3000))};else{timer=setTimeout(()=>{ready=true;started=performance.now();button.textContent='TAP!';button.classList.add('ready')},1200+Math.random()*2500);button.onclick=()=>{if(!ready){clearTimeout(timer);return finish(1200)}finish(performance.now()-started)}};
  function finish(error){button.disabled=true;const score=Math.max(0,Math.round(10-error/100));player.score+=score;$('#reactionResult').innerHTML=`${stopMode?`${(error/1000).toFixed(2)}s from target`:`${Math.round(error)} ms`} · +${score} points <button id="nextReaction">Next</button>`;$('#nextReaction').onclick=()=>{arcadeState.round++;renderArcade()}}
}

function renderDrawing(){
  if(arcadeState.round>=arcadeState.rounds)return finishArcade();const player=arcadeState.players[arcadeState.round%arcadeState.players.length],prompts=['Draw a famous album cover','Draw a musical instrument','Draw a song title without words','Draw a concert scene'],prompt=prompts[arcadeState.round%prompts.length];
  $('#arcadeStage').innerHTML=`<section class="drawing-card"><p class="eyebrow">${escapeHtml(player.name)} DRAWS</p><h2>${escapeHtml(prompt)}</h2><canvas id="drawingCanvas" width="800" height="450"></canvas><div class="drawing-tools"><input id="drawColor" type="color" value="#7650ff"><input id="drawSize" type="range" min="2" max="30" value="7"><button id="clearDrawing">Clear</button></div><h3>Who guessed first?</h3><div class="player-vote-grid">${playerButtons('drawing-award')}</div><button id="skipDrawing">No correct guess</button></section>`;const canvas=$('#drawingCanvas'),context=canvas.getContext('2d');context.lineCap='round';let drawing=false;const point=event=>{const rect=canvas.getBoundingClientRect(),touch=event.touches?.[0]||event;return{x:(touch.clientX-rect.left)*canvas.width/rect.width,y:(touch.clientY-rect.top)*canvas.height/rect.height}};const start=event=>{drawing=true;const p=point(event);context.beginPath();context.moveTo(p.x,p.y);event.preventDefault()};const move=event=>{if(!drawing)return;const p=point(event);context.strokeStyle=$('#drawColor').value;context.lineWidth=$('#drawSize').value;context.lineTo(p.x,p.y);context.stroke();event.preventDefault()};canvas.onpointerdown=start;canvas.onpointermove=move;canvas.onpointerup=canvas.onpointerleave=()=>drawing=false;$('#clearDrawing').onclick=()=>context.clearRect(0,0,canvas.width,canvas.height);$$('.drawing-award').forEach(button=>button.onclick=()=>{arcadeState.players[Number(button.dataset.player)].score++;arcadeState.round++;renderArcade()});$('#skipDrawing').onclick=()=>{arcadeState.round++;renderArcade()}
}

function playerButtons(className){return arcadeState.players.map((player,index)=>`<button type="button" class="${className}" data-player="${index}">${escapeHtml(player.name)}</button>`).join('')}
function bindAwardButtons(){
  $$('.award-point, .vote-player',$('#arcadeStage')).forEach(button=>button.onclick=()=>{arcadeState.players[Number(button.dataset.player)].score++;arcadeState.round++;renderArcade()});
}

function finishArcade(){
  clearInterval(countdownId);
  const teamMode=arcadeState.mode.teams,ranked=[...arcadeState.players].sort((a,b)=>b.score-a.score),teamScores=teamMode?[0,1].map(team=>arcadeState.players.filter(p=>p.team===team).reduce((sum,p)=>sum+p.score,0)):null;
  const winner=teamMode?`Team ${teamScores[1]>teamScores[0]?'Lime':'Purple'}`:ranked[0].name;
  saveArcadeRecords();
  $('#arcadeRoundLabel').textContent='Game complete';
  $('#arcadeStage').innerHTML=`<section class="arcade-final"><span class="final-disc">🏆</span><p class="eyebrow">${escapeHtml(arcadeState.mode.name.toUpperCase())} WINNER</p><h2>${escapeHtml(winner)}</h2>${teamMode?`<div class="team-results"><b>Team Purple · ${teamScores[0]}</b><b>Team Lime · ${teamScores[1]}</b></div>`:`<div class="arcade-podium">${ranked.map((player,index)=>`<article><span>${index+1}</span><div><b>${escapeHtml(player.name)}</b><small>${player.picks.length} picks</small></div><strong>${player.score} pts</strong></article>`).join('')}</div>`}${renderLineups()}${arcadeState.mode.trade?renderTradeTable():''}<div class="final-actions"><button id="arcadeAgain" class="primary">Play again</button><button id="arcadeAllGames">All games</button></div></section>`;
  $('#arcadeAgain').onclick=()=>openSetup(arcadeState.mode.id);$('#arcadeAllGames').onclick=()=>{showScreen('arcade');history.pushState({},'',new URL('?page=arcade',location.href))};bindTrade();
}

function renderLineups(){if(!arcadeState.players.some(p=>p.picks.length))return'';return`<div class="arcade-lineups">${arcadeState.players.map(player=>`<article><h3>${escapeHtml(player.name)}</h3>${player.picks.map(pick=>`<p><b>${escapeHtml(pick.slot||'Pick')}</b><span>${escapeHtml(pick.name)}</span></p>`).join('')}</article>`).join('')}</div>`}
function renderTradeTable(){const eligible=arcadeState.players.filter(p=>p.picks.length);if(eligible.length<2)return'';return`<section class="trade-table"><h3>Optional trade table</h3><p>Swap the first picks of two players, then compare the new lineups.</p><select id="tradeA">${eligible.map((p,i)=>`<option value="${arcadeState.players.indexOf(p)}">${escapeHtml(p.name)} · ${escapeHtml(p.picks[0].name)}</option>`).join('')}</select><select id="tradeB">${eligible.map((p,i)=>`<option value="${arcadeState.players.indexOf(p)}" ${i===1?'selected':''}>${escapeHtml(p.name)} · ${escapeHtml(p.picks[0].name)}</option>`).join('')}</select><button id="confirmTrade" class="smallbtn">Confirm trade</button><p id="tradeNotice"></p></section>`}
function bindTrade(){const button=$('#confirmTrade');if(!button)return;button.onclick=()=>{const a=Number($('#tradeA').value),b=Number($('#tradeB').value);if(a===b)return $('#tradeNotice').textContent='Choose two different players.';[arcadeState.players[a].picks[0],arcadeState.players[b].picks[0]]=[arcadeState.players[b].picks[0],arcadeState.players[a].picks[0]];$('#tradeNotice').className='success';$('#tradeNotice').textContent='Trade complete!'}}
function saveArcadeRecords(){const records=JSON.parse(localStorage.getItem('draftDuelArcadeRecords')||'{}');for(const player of arcadeState.players){const key=player.name.toLowerCase();records[key]??={games:0,wins:0,best:0};records[key].games++;records[key].best=Math.max(records[key].best,player.score)}const max=Math.max(...arcadeState.players.map(p=>p.score));arcadeState.players.filter(p=>p.score===max).forEach(p=>records[p.name.toLowerCase()].wins++);localStorage.setItem('draftDuelArcadeRecords',JSON.stringify(records))}
function hash(text){return[...String(text)].reduce((value,char)=>(value*31+char.charCodeAt(0))>>>0,7)}

$('#arcadeSearch').oninput=event=>renderCatalogue($('#arcadeFilters .active')?.dataset.filter||'All',event.target.value);
window.ArtistPicker?.attach($('#arcadeArtistSearch'),{multiple:true,onSelect:addSelectedArtist});
$('#arcadeAddPlayer').onclick=()=>addPlayer();
$('#arcadeStart').onclick=startGame;
$('#arcadeBack').onclick=()=>{showScreen('arcade');history.pushState({},'',new URL('?page=arcade',location.href))};
$('#arcadeQuit').onclick=()=>{clearInterval(countdownId);if(confirm('Leave this arcade game?')){showScreen('arcade');history.pushState({},'',new URL('?page=arcade',location.href))}};
renderCatalogue();

const route=new URL(location.href);
if(route.searchParams.get('page')==='arcade'&&route.searchParams.get('mode'))openSetup(route.searchParams.get('mode'));
