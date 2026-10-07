export const TIERS = ['D','C','B','A','S','Omega'] as const;
export type Tier = typeof TIERS[number];
export const COSTS:Record<Tier,number>={D:0,C:0,B:0,A:0,S:0,Omega:0};
export const TIER_COLORS:Record<Tier,string>={D:'#b4c3d7',C:'#5bde9a',B:'#50b8ff',A:'#b38bff',S:'#ffc858',Omega:'#ff77c8'};
export const TEAMS=['North','South','East','West'];
export const TEAM_COLORS=['#ff5267','#4ea1ff','#48e5a0','#ffcf4b'];
export type MoveKind='strike'|'beam'|'blast'|'dash'|'shield'|'heal'|'pull'|'stun'|'flight'|'switch';
export type Move={name:string;kind:MoveKind;cooldown:number;description:string};
export type Fighter={id:string;name:string;world:string;tier:Tier;color:string;accent:string;skin:string;model:string;height:number;fly:boolean;moves:[Move,Move];ult:Move;hp:number;damage:number;speed:number;range:number};
// Rankings are Alex's custom game rankings, not claims about canon power levels.
const data: [string,string,Tier,string,string,string,number,string,string,string][]=[
['Uncle Iroh','Avatar','Omega','#8a3425','#eac580','sage',1.85,'Dragon Breath:beam','Tea Break:heal','Dragon of the West:blast'],
['Splinter','TMNT','Omega','#693d30','#bd9c77','rat',1.7,'Staff Sweep:strike','Shadow Step:dash','Master’s Lesson:stun'],
['Oogway','Kung Fu Panda','Omega','#bcab73','#5d8051','tortoise',1.7,'Peach Blossom:heal','Spirit Step:dash','Ascension:blast'],
['Waluigi','Mario','Omega','#752bba','#ecce32','plumber',2.1,'Wah Dash:dash','Racket Smash:strike','Waluigi Time:stun'],
['John Cena','WWE','Omega','#39b53d','#245bb7','wrestler',1.85,'Shoulder Tackle:dash','You Can’t See Me:shield','Attitude Adjustment:strike'],
['Jon Jones','MMA','Omega','#16191d','#c7a05c','fighter',1.93,'Oblique Kick:strike','Clinch:stun','Five-Minute Finish:strike'],
['Silver Surfer','Marvel','S','#c0d6e6','#76e9ff','surfer',1.93,'Cosmic Flight:flight','Power Cosmic:beam','Cosmic Nova:blast'],
['Ghost Rider','Marvel','S','#202229','#ff6b12','flame',1.9,'Hellfire Chain:pull','Hellfire:beam','Penance Stare:stun'],
['Superman','DC','S','#174fac','#e52835','cape',1.91,'Flight:flight','Super Punch:strike','Heat Vision:beam'],
['Goku','Dragon Ball','S','#f77d20','#2547ad','spiky',1.75,'Flight:flight','Instant Transmission:dash','Kamehameha:beam'],
['Naruto','Naruto','S','#f18424','#171c28','blond',1.8,'Rasengan:strike','Shadow Clone Rush:dash','Six Paths Barrage:blast'],
['Sasuke','Naruto','S','#424373','#ab85dc','ninja',1.82,'Chidori:dash','Amaterasu:beam','Susanoo:blast'],
['Gojo','Jujutsu Kaisen','S','#111627','#e5f6ff','blindfold',1.9,'Infinity:shield','Blue:pull','Hollow Purple:beam'],
['Sukuna','Jujutsu Kaisen','S','#ded9ce','#bc6577','tattoo',1.85,'Dismantle:beam','Cleave:strike','Malevolent Shrine:blast'],
['Thragg','Invincible','S','#f1efea','#b72c42','mustache',1.96,'Flight:flight','Viltrumite Crush:strike','Empire Breaker:blast'],
['Sun Wukong','Journey to the West','S','#cb942c','#ac2424','monkey',1.8,'Cloud Flight:flight','Extending Staff:beam','Seventy-Two Transformations:blast'],
['Hulk','Marvel','A','#447d42','#6b3d8e','brute',3.4,'Thunderclap:blast','Gamma Leap:dash','Worldbreaker:blast'],
['Thor','Marvel','A','#3e495a','#b92730','cape',2.0,'Flight:flight','Mjolnir:beam','God of Thunder:blast'],
['Magneto','Marvel','A','#92202f','#6940a2','helmet',1.88,'Magnetic Flight:flight','Metal Crush:pull','Magnetic Storm:blast'],
['Professor X','Marvel','A','#336644','#83c8ff','chair',1.55,'Psychic Lock:stun','Mind Shield:shield','Cerebro:blast'],
['Flash','DC','A','#c92632','#f8d840','mask',1.83,'Speed Force:dash','Infinite Mass Punch:strike','Speed Force Storm:blast'],
['Yoda','Star Wars','A','#a89870','#78ed69','yoda',.85,'Force Push:blast','Saber Leap:dash','Force Mastery:stun'],
['Yuji','Jujutsu Kaisen','A','#152846','#e9575b','pinkhair',1.73,'Divergent Fist:strike','Black Flash:dash','Soul Strike:strike'],
['Invincible','Invincible','A','#e6c839','#3b73a7','goggles',1.8,'Flight:flight','Viltrumite Punch:strike','Never Back Down:blast'],
['Levi','Attack on Titan','A','#495a3a','#eee8d1','scout',1.6,'ODM Grapple:dash','Blade Spin:strike','Captain’s Assault:blast'],
['Kratos','God of War','A','#a8998b','#a22726','kratos',2.05,'Leviathan Axe:beam','Blades of Chaos:pull','Spartan Rage:blast'],
['Shadow','Sonic','A','#22212b','#dc3342','hedgehog',1.05,'Chaos Control:stun','Chaos Spear:beam','Chaos Blast:blast'],
['Battle Beast','Invincible','A','#efeee2','#973a35','lion',2.5,'Battle Axe:strike','Warrior’s Leap:dash','Unending Rage:blast'],
['Toji','Jujutsu Kaisen','A','#151c23','#e0e4d7','ninja',1.88,'Heavenly Rush:dash','Inverted Spear:strike','Sorcerer Killer:strike'],
['Darth Vader','Star Wars','B','#15171b','#ff313d','vader',2.03,'Force Choke:stun','Saber Throw:beam','Dark Side:blast'],
['Luke Skywalker','Star Wars','B','#202529','#6bff86','jedi',1.72,'Force Push:blast','Saber Rush:dash','Jedi Resolve:shield'],
['Itachi','Naruto','B','#1d202a','#bd2435','akatsuki',1.78,'Amaterasu:beam','Crow Step:dash','Tsukuyomi:stun'],
['Minato','Naruto','B','#e6e5d9','#e25236','blondcape',1.79,'Flying Raijin:dash','Rasengan:strike','Yellow Flash:blast'],
['Kakashi','Naruto','B','#526443','#c6cfd6','silverhair',1.81,'Lightning Blade:dash','Earth Wall:shield','Kamui:stun'],
['Geto','Jujutsu Kaisen','B','#232034','#9c7853','longhair',1.87,'Spirit Swarm:beam','Cursed Guard:shield','Maximum Uzumaki:beam'],
['Yuta','Jujutsu Kaisen','B','#e2e3de','#6b53a5','swordsman',1.78,'Cursed Blade:strike','Reverse Technique:heal','Rika:blast'],
['Jogo','Jujutsu Kaisen','B','#d2ac61','#f97925','volcano',1.5,'Ember Insects:beam','Volcanic Burst:blast','Maximum Meteor:blast'],
['Omni-Man','Invincible','B','#eeeeea','#c92f3c','mustachecape',1.88,'Flight:flight','Viltrumite Strike:strike','Think, Mark:blast'],
['Tai Lung','Kung Fu Panda','A','#8c939e','#c1b8a0','leopard',1.9,'Nerve Strike:stun','Leopard Leap:dash','Prison Break:blast'],
['Po','Kung Fu Panda','B','#f0eee4','#20252a','panda',2.0,'Belly Bounce:blast','Dumpling Recovery:heal','Wuxi Finger Hold:strike'],
['Ozai','Avatar','B','#741d25','#ec9e2b','firelord',1.9,'Fire Flight:flight','Lightning:beam','Comet’s Wrath:blast'],
['Aang','Avatar','B','#eab346','#e96e30','airbender',1.55,'Air Scooter:dash','Air Shield:shield','Avatar State:blast'],
['Optimus Prime','Transformers','B','#c6353a','#315ab1','robot',5.4,'Ion Blaster:beam','Energon Axe:strike','Autobot Barrage:blast'],
['Megatron','Transformers','B','#8a909d','#9430af','robot',5.8,'Fusion Cannon:beam','Energon Mace:strike','Decepticon Wrath:blast'],
['Godzilla','MonsterVerse','B','#394e51','#57c9ff','kaiju',9,'Atomic Breath:beam','Tail Sweep:blast','Nuclear Pulse:blast'],
['Kong','MonsterVerse','B','#69513f','#a98663','ape',7.5,'Titan Axe:strike','Ground Slam:blast','King’s Fury:blast'],
['Iron Man','Marvel','C','#bb3138','#e4ba52','armor',1.85,'Flight:flight','Repulsor:beam','Unibeam:beam'],
['Spider-Man','Marvel','C','#cf303c','#2459a2','spider',1.78,'Web Zip:dash','Web Shot:stun','Web Barrage:blast'],
['Wolverine','Marvel','C','#ebbd2f','#2c518c','claws',1.6,'Claw Lunge:dash','Healing Factor:heal','Berserker Rage:strike'],
['Batman','DC','C','#3c4652','#171c26','bat',1.88,'Grapnel:dash','Batarang:beam','Fear Takedown:stun'],
['Darth Maul','Star Wars','C','#242126','#e5323d','maul',1.75,'Saber Spin:strike','Force Dash:dash','Duel of the Fates:blast'],
['Obi-Wan','Star Wars','C','#c6b58f','#57baff','jedi',1.82,'Force Push:blast','Soresu:shield','High Ground:blast'],
['Rock Lee','Naruto','C','#357440','#e68039','bowl',1.72,'Leaf Hurricane:strike','Lotus Rush:dash','Eight Gates:blast'],
['Gaara','Naruto','C','#7f3037','#d9b47a','gourd',1.66,'Sand Shield:shield','Sand Coffin:stun','Sand Tsunami:blast'],
['Megumi','Jujutsu Kaisen','C','#1e283f','#98a3c6','spiky',1.75,'Divine Dogs:beam','Shadow Step:dash','Chimera Shadow Garden:blast'],
['Eren','Attack on Titan','C','#3a4036','#a98a69','titan',4.5,'Titan Punch:strike','Hardening:shield','Attack Titan:blast'],
['Zuko','Avatar','C','#983126','#eeb148','firelord',1.73,'Fire Daggers:strike','Fire Blast:beam','Dragon Flame:beam'],
['King Bumi','Avatar','C','#7b9b54','#d0c0a0','sage',1.85,'Earth Wall:shield','Boulder:beam','Mountain Breaker:blast'],
['Sonic','Sonic','C','#2873d3','#e73c35','hedgehog',1.05,'Spin Dash:dash','Homing Attack:strike','Super Sonic:blast'],
['Bumblebee','Transformers','C','#ecc238','#242b35','robot',3.8,'Stinger:beam','Combat Roll:dash','Hive Strike:blast'],
['Shredder','TMNT','C','#717583','#784592','blades',1.9,'Blade Rush:dash','Steel Claws:strike','Shredder’s Fury:blast'],
['Mario','Mario','C','#d82e37','#3154a6','plumber',1.55,'Fireball:beam','Super Jump:dash','Super Star:shield'],
['Bowser','Mario','C','#dda837','#52954d','bowser',3,'Fire Breath:beam','Shell Slam:blast','Giga Bowser:blast'],
['Donkey Kong','Mario','C','#92582e','#dc3935','ape',2.7,'Giant Punch:strike','Barrel Roll:dash','Jungle Beat:blast'],
['Little Mac','Punch-Out','C','#43b556','#222930','boxer',1.7,'Jab Combo:strike','Slip:shield','KO Punch:strike'],
['Katara','Avatar','D','#4294c0','#d1e9f0','longhair',1.68,'Water Whip:beam','Healing Water:heal','Tidal Wave:blast'],
['Toph','Avatar','D','#759b47','#e8ce78','bowl',1.4,'Rock Fist:strike','Earth Armor:shield','Seismic Wave:blast'],
['Tails','Sonic','D','#eea638','#fff1d2','fox',.95,'Tail Flight:flight','Wrench Strike:strike','Tornado Barrage:blast'],
['Knuckles','Sonic','D','#d94043','#faf3da','hedgehog',1.1,'Glide:dash','Knuckle Smash:strike','Master Emerald:blast'],
['Amy','Sonic','D','#e984ba','#d93067','hedgehog',1,'Hammer Slam:strike','Spin Jump:dash','Piko Piko Storm:blast'],
['Leonardo','TMNT','D','#59885a','#4c86e4','turtle',1.8,'Twin Katana:strike','Ninja Dash:dash','Leader’s Resolve:shield'],
['Raphael','TMNT','D','#4c794c','#e63f45','turtle',1.8,'Sai Strike:strike','Shell Guard:shield','Hothead Rush:blast'],
['Donatello','TMNT','D','#618c54','#a262d2','turtle',1.8,'Bo Staff:strike','Tech Pulse:stun','Genius Barrage:blast'],
['Michelangelo','TMNT','D','#649850','#ed963d','turtle',1.8,'Nunchuck Spin:strike','Pizza Break:heal','Cowabunga:blast'],
['Furious Five','Kung Fu Panda','D','#df9d43','#34352d','tiger',1.75,'Switch Master:switch','Kung Fu Combo:strike','Five as One:blast'],
['Luigi','Mario','D','#43a751','#344fb0','plumber',1.75,'Fireball:beam','Super Jump:dash','Poltergust:pull'],
['Wario','Mario','D','#eaca34','#7e42a4','plumber',1.7,'Shoulder Bash:dash','Garlic Recovery:heal','Wario Waft:blast'],
['The Undertaker','WWE','D','#22232b','#795896','wrestler',2.08,'Chokeslam:strike','Deadman Guard:shield','Tombstone:strike'],
['The Rock','WWE','D','#20232b','#c2a269','wrestler',1.96,'Spinebuster:strike','Shoulder Charge:dash','People’s Elbow:strike'],
['Rey Mysterio','WWE','D','#32aaca','#ebca48','luchador',1.68,'Springboard:dash','Hurricanrana:strike','619:strike'],
['Randy Orton','WWE','D','#20272e','#c7b4a1','wrestler',1.96,'Powerslam:strike','Viper Step:dash','RKO:strike'],
];
const descriptions:Record<MoveKind,string>={strike:'Close-range hit in front of you.',beam:'Aimed ranged attack; cover blocks the shot.',blast:'Area attack around you; cover blocks damage.',dash:'Burst forward, striking nearby enemies.',shield:'Temporary damage reduction.',heal:'Restore your health.',pull:'Drag nearby enemies toward you.',stun:'Damage and briefly stun enemies in front.',flight:'Fly for 10 seconds, then land. 18-second recharge.',switch:'Cycle Tigress, Monkey, Mantis, Viper and Crane; each has a different combat bonus.'};
function move(s:string,ult=false):Move {const [name,kind]=s.split(':') as [string,MoveKind];return {name,kind,cooldown:ult?12:kind==='flight'?28:kind==='heal'?12:kind==='shield'?10:kind==='stun'?8:5,description:descriptions[kind]};}
export const ROSTER:Fighter[]=data.map(([name,world,tier,color,accent,model,height,m1,m2,u])=>{const rank=TIERS.indexOf(tier);return {id:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,world,tier,color,accent,model,height,skin:['Jon Jones','The Rock'].includes(name)?'#95694e':'#d9b18f',fly:m1.endsWith(':flight')||m2.endsWith(':flight'),moves:[move(m1),move(m2)],ult:move(u,true),hp:[150,210,285,370,490,620][rank]+(height>3?100:0),damage:[14,19,26,34,45,58][rank],speed:(name==='Flash'?13:name==='Sonic'||name==='Shadow'?11:height>4?5.5:7),range:world==='WWE'||world==='MMA'?3.7:5};});
export const FIGHTERS=Object.fromEntries(ROSTER.map(c=>[c.id,c])) as Record<string,Fighter>;
const signature:Record<string,Move>={
 superman:{name:'Heat Vision',kind:'beam',cooldown:.55,description:'Twin beams fired from Superman’s eyes.'},
 goku:{name:'Kamehameha',kind:'beam',cooldown:.7,description:'A focused ki wave.'},
 naruto:{name:'Rasengan',kind:'beam',cooldown:.65,description:'A spinning blue chakra sphere launched toward the target.'},
 'iron-man':{name:'Repulsor',kind:'beam',cooldown:.5,description:'A rapid armor repulsor shot.'},
 'spider-man':{name:'Web Shot',kind:'beam',cooldown:.45,description:'A fast web projectile.'},
 thor:{name:'Mjolnir',kind:'beam',cooldown:.7,description:'Throw Mjolnir toward the target.'},
 godzilla:{name:'Atomic Breath',kind:'beam',cooldown:.9,description:'A focused atomic energy beam.'},
 gojo:{name:'Blue',kind:'pull',cooldown:.8,description:'A compressed cursed-energy sphere.'},
 sukuna:{name:'Dismantle',kind:'beam',cooldown:.55,description:'A fast invisible cutting slash.'},
 'darth-vader':{name:'Saber Throw',kind:'beam',cooldown:.7,description:'Throw the lightsaber toward the target.'},
 mario:{name:'Fireball',kind:'beam',cooldown:.55,description:'Throw a bouncing fireball.'}
};
const ultimateOverride:Record<string,Move>={superman:{name:'Solar Overload',kind:'blast',cooldown:12,description:'Release stored solar energy in a massive burst.'},goku:{name:'Spirit Bomb',kind:'blast',cooldown:12,description:'Detonate a huge sphere of gathered energy.'}};
export function fighterPrimary(c:Fighter):Move{return signature[c.id]||c.moves.find(m=>m.kind==='beam')||c.moves.find(m=>m.kind==='strike')||c.moves[0]}
export function fighterPower(c:Fighter):Move{const primary=fighterPrimary(c);return c.moves.find(m=>m.name!==primary.name&&['flight','shield','heal','dash','pull','stun','switch'].includes(m.kind))||c.moves.find(m=>m.name!==primary.name)||c.moves[0]}
export function fighterUltimate(c:Fighter):Move{return ultimateOverride[c.id]||c.ult}
export const WORLDS=Array.from(new Set(ROSTER.map(c=>c.world)));
export const WORLD_SCENES:Record<string,{name:string;scene:string}>={Marvel:{name:'Avengers Tower',scene:'manhattan'},DC:{name:'Gotham Skyline',scene:'gotham'},'Star Wars':{name:'Death Star Hangar',scene:'deathstar'},Naruto:{name:'Hidden Leaf Village',scene:'leaf'},'Jujutsu Kaisen':{name:'Shibuya Crossing',scene:'shibuya'},'Kung Fu Panda':{name:'Jade Palace',scene:'jade'},Avatar:{name:'Fire Nation Palace',scene:'palace'},TMNT:{name:'NYC Sewers',scene:'sewer'},Mario:{name:'Mushroom Kingdom',scene:'mushroom'},Sonic:{name:'Green Hill Zone',scene:'greenhill'},Transformers:{name:'Cybertron',scene:'cybertron'},MonsterVerse:{name:'Titan City',scene:'city'},Invincible:{name:'Guardians Skyline',scene:'metropolis'},'Attack on Titan':{name:'Wall Maria',scene:'wall'},'Dragon Ball':{name:'World Tournament',scene:'tournament'},'God of War':{name:'Lake of Nine',scene:'ruins'},'Journey to the West':{name:'Flower Fruit Mountain',scene:'jade'},WWE:{name:'WrestleMania',scene:'ring'},MMA:{name:'The Octagon',scene:'ring'},'Punch-Out':{name:'World Circuit',scene:'ring'}};
export const FIGHTER_SCENES:Partial<Record<string,{name:string;scene:string}>>={
 'silver-surfer':{name:'Deep Space',scene:'cosmic'},'ghost-rider':{name:'Hell’s Highway',scene:'hell'},hulk:{name:'Harlem',scene:'manhattan'},thor:{name:'Asgard',scene:'asgard'},magneto:{name:'Genosha',scene:'genosha'},'professor-x':{name:'Xavier Institute',scene:'mansion'},'iron-man':{name:'Avengers Tower',scene:'manhattan'},'spider-man':{name:'Manhattan Rooftops',scene:'manhattan'},wolverine:{name:'Canadian Wilderness',scene:'forest'},
 superman:{name:'Metropolis',scene:'metropolis'},batman:{name:'Gotham City',scene:'gotham'},flash:{name:'Central City',scene:'centralcity'},
 'darth-vader':{name:'Death Star Hangar',scene:'deathstar'},'darth-maul':{name:'Naboo Reactor',scene:'reactor'},'luke-skywalker':{name:'Tatooine',scene:'desert'},yoda:{name:'Dagobah',scene:'swamp'},'obi-wan':{name:'Mustafar',scene:'mustafar'},
 splinter:{name:'NYC Sewers',scene:'sewer'},shredder:{name:'Foot Clan Lair',scene:'dojo'},leonardo:{name:'NYC Sewers',scene:'sewer'},raphael:{name:'NYC Sewers',scene:'sewer'},donatello:{name:'NYC Sewers',scene:'sewer'},michelangelo:{name:'NYC Sewers',scene:'sewer'},
 kratos:{name:'Lake of Nine',scene:'ruins'},godzilla:{name:'Tokyo Bay',scene:'titan'},kong:{name:'Skull Island',scene:'jungle'}
};
