(()=>{'use strict';
const activities=window.WWM_ACTIVITIES||[], $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], limitedSource=window.WWM_LIMITED_EVENTS;let limitedEvents=limitedSource?.events?.map(a=>({...a,period:'Limited'}))||[],eventsLoaded=true,eventsLoadError=!limitedSource;
const state={period:'Daily',goal:'role',priority:'all',search:'',hide:false,sort:'default',direction:1};
const RANK={高:3,中:2,低:1}, TIME_RANK={'极低':1,'低':2,'中':3,'高':4,'不定，通常久':5};
const bjParts=(d=new Date())=>Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
function effectiveDate(){const p=bjParts();return new Date(Date.UTC(+p.year,+p.month-1,+p.day,+p.hour-5))}
function resetKey(period){const d=effectiveDate();if(period==='Daily')return d.toISOString().slice(0,10);if(period==='Monthly')return d.toISOString().slice(0,7);const since=(d.getUTCDay()-1+7)%7;return new Date(d.getTime()-since*864e5).toISOString().slice(0,10)}
function storage(){try{return JSON.parse(localStorage.getItem('wwm-checklist-v1')||'{}')}catch{return {}}}
function completionKey(a){if(a.period!=='Limited')return resetKey(a.period);const r=a.completionReset||{};if(r.type==='daily')return resetKey('Daily');if(r.type==='weekly')return resetKey('Weekly');if(r.type==='once'&&r.at)return `${Date.now()<Date.parse(r.at)?'before':'after'}:${r.at}`;return 'event'}
function isDone(a){return !!storage()[`${a.period}:${completionKey(a)}:${a.id}`]}
function setDone(a,v){const s=storage(),k=`${a.period}:${completionKey(a)}:${a.id}`;v?s[k]=true:delete s[k];localStorage.setItem('wwm-checklist-v1',JSON.stringify(s))}
function currentPriority(a){return a.priority[state.goal]}
function inPeriod(a){if(state.period==='Limited')return a.period==='Limited';return state.period==='Daily'?a.period==='Daily':a.period==='Weekly'||a.period==='Monthly'}
function timeLevel(a){return a.time.startsWith('不定')?'不定，通常久':a.time.split(/（|\s*\(/)[0].trim()}
function defaultCompare(a,b){return Number(isDone(a))-Number(isDone(b))||RANK[currentPriority(b)]-RANK[currentPriority(a)]||a.category.localeCompare(b.category,'zh-CN')||a.name.localeCompare(b.name,'zh-CN')}
function compareActivities(a,b){if(state.sort==='default')return defaultCompare(a,b);let n=0;if(state.sort==='completion')n=Number(isDone(a))-Number(isDone(b));else if(state.sort==='priority')n=RANK[currentPriority(b)]-RANK[currentPriority(a)];else if(state.sort==='time')n=TIME_RANK[timeLevel(a)]-TIME_RANK[timeLevel(b)];else if(state.sort==='category')n=a.category.localeCompare(b.category,'zh-CN');else n=a.name.localeCompare(b.name,'zh-CN');return n*state.direction||defaultCompare(a,b)}
function activeLimitedEvents(){return limitedEvents.filter(a=>Date.now()<Date.parse(a.expirationDate))}
function sourceActivities(){return state.period==='Limited'?activeLimitedEvents():activities}
function filtered(){return sourceActivities().filter(a=>inPeriod(a)&&(state.priority==='all'||currentPriority(a)===state.priority)&&(!state.hide||!isDone(a))&&(!state.search||a.rewards.toLowerCase().includes(state.search))).sort(compareActivities)}
function escapeHtml(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
function nameHtml(a){const n=escapeHtml(a.name);return a.link?`<a href="${a.link}">${n}</a>`:n}
function timeHtml(a){const l=escapeHtml(timeLevel(a)),n=escapeHtml(a.time.slice(timeLevel(a).length));return `<span class="time-level">${l}</span>${n?` <span class="time-note">${n}</span>`:''}`}
function deadlineHtml(a){const ms=Date.parse(a.expirationDate)-Date.now(),days=Math.ceil(ms/864e5),level=days<=3?'urgent':days<=7?'soon':'';const text=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(a.expirationDate));return `<div class="deadline ${level}"><strong>${text}</strong><small>${days<=1?'不足 1 天':`剩余 ${days} 天`}</small></div>`}
function sortMark(key){return state.sort===key?(state.direction===1?' ↑':' ↓'):' ↕'}
function render(){const rows=filtered(),limited=state.period==='Limited',list=$('#activity-list');list.classList.toggle('limited',limited);list.innerHTML=`<div class="activity-head"><button data-sort="completion" aria-label="按完成状态排序">完成${sortMark('completion')}</button><span>活动</span><button data-sort="category" aria-label="按活动类别排序">类别${sortMark('category')}</button><button data-sort="priority" aria-label="按优先级排序">优先级${sortMark('priority')}</button><span>主要奖励 / 目标</span><button data-sort="time" aria-label="按用时排序">用时${sortMark('time')}</button>${limited?'<span>截止日期</span>':''}<span></span></div>`+rows.map(a=>`<div class="activity-row ${isDone(a)?'done':''}" data-id="${a.id}"><input class="check" type="checkbox" ${isDone(a)?'checked':''} aria-label="标记${escapeHtml(a.name)}完成"><div><div class="activity-name">${nameHtml(a)}</div><div class="badges">${a.period==='Monthly'?'<span class="badge period-badge">每月</span>':''}${a.guild?'<span class="badge guild">百业活跃</span>':''}</div></div><div class="activity-category">${escapeHtml(a.category)}</div><div><span class="priority ${currentPriority(a)==='高'?'high':currentPriority(a)==='中'?'medium':'low'}">${currentPriority(a)}</span></div><div class="reward">${escapeHtml(a.rewards)}</div><div class="guide">${timeHtml(a)}</div>${limited?deadlineHtml(a):''}<button class="details" aria-label="展开详情" aria-expanded="false">⌄</button><div class="activity-detail"><p><strong>做法 / 攻略</strong><br>${escapeHtml(a.guide||'暂无')}</p><p><strong>备注</strong><br>${escapeHtml(a.notes||'暂无')}</p></div></div>`).join('');const empty=$('#empty-state');empty.textContent=limited&&!eventsLoaded?'正在载入限时活动…':limited&&eventsLoadError?'限时活动载入失败，请刷新页面重试。':'没有符合当前筛选条件的活动。';empty.classList.toggle('load-error',limited&&eventsLoadError);empty.hidden=rows.length>0;updateProgress()}
function group(p){if(p==='Limited')return activeLimitedEvents();return activities.filter(a=>p==='Daily'?a.period==='Daily':a.period!=='Daily')}
function updateProgress(){const l=group('Limited'),d=group('Daily'),r=group('Recurring');$('#limited-count').textContent=`${l.filter(isDone).length}/${l.length}`;$('#daily-count').textContent=`${d.filter(isDone).length}/${d.length}`;$('#recurring-count').textContent=`${r.filter(isDone).length}/${r.length}`;const all=group(state.period),done=all.filter(isDone).length;$('#progress-label').textContent=state.period==='Limited'?'限时活动进度':state.period==='Daily'?'今日进度':'本周 / 本月进度';$('#progress-text').textContent=`${done} / ${all.length}`;$('#progress-bar').style.width=(all.length?done/all.length*100:0)+'%'}
function clock(){const p=bjParts();$('#beijing-time').textContent=`北京时间 ${p.hour}:${p.minute}`;$('#next-reset').textContent=state.period==='Limited'?'完成状态按各活动规则重置':state.period==='Daily'?'每日 05:00 重置':'每周一 / 每月1日 05:00 重置'}
function defaultDirection(key){return key==='priority'?1:1}
$('#activity-list').addEventListener('click',e=>{if(e.target.dataset.sort){const key=e.target.dataset.sort;state.direction=state.sort===key?-state.direction:defaultDirection(key);state.sort=key;render();return}const row=e.target.closest('.activity-row');if(!row)return;const a=[...activities,...limitedEvents].find(x=>x.id===row.dataset.id);if(e.target.matches('.check')){setDone(a,e.target.checked);render()}else if(e.target.matches('.details')){row.classList.toggle('expanded');e.target.setAttribute('aria-expanded',row.classList.contains('expanded'));e.target.textContent=row.classList.contains('expanded')?'⌃':'⌄'}});
$$('.period-tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.period-tabs button').forEach(x=>x.setAttribute('aria-selected','false'));b.setAttribute('aria-selected','true');state.period=b.dataset.period;render();clock()}));
$('#goal-filter').addEventListener('change',e=>{state.goal=e.target.value;render()});
$('#priority-filter').addEventListener('change',e=>{state.priority=e.target.value;render()});
$('#search').addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();$$('.quick-search button').forEach(b=>b.classList.toggle('active',b.textContent===e.target.value));render()});
$('#hide-completed').addEventListener('change',e=>{state.hide=e.target.checked;render()});
$$('.quick-search button').forEach(b=>b.addEventListener('click',()=>{$('#search').value=$('#search').value===b.textContent?'':b.textContent;state.search=$('#search').value.toLowerCase();$$('.quick-search button').forEach(x=>x.classList.toggle('active',x===b&&!!state.search));render()}));
function route(){const [requestedPage,requestedArticle]=location.hash.slice(1).split('/'),id=document.getElementById(requestedPage)?requestedPage:'checklist';$$('.page').forEach(x=>x.classList.toggle('active',x.id===id));$$('#main-nav a').forEach(x=>x.classList.toggle('active',x.hash==='#'+id));if(id==='knowledge')renderKnowledge(articles[requestedArticle]?requestedArticle:'energy');if(id==='guild')renderGuild(['activity','perks'].includes(requestedArticle)?requestedArticle:'activity');$('#main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}
window.addEventListener('hashchange',route);$('.menu-toggle').addEventListener('click',e=>{const open=$('#main-nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open)});
const shopRows=[
['赛季商店（不肝商店） - 赛季追赶','通宝','每周刷新','image20.png','长期每周必买'],
['赛季商店-战斗养成','啸玉 （当前阶的叠音材料）','每周刷新，剩余库存不清空','image10.png','长期每周必买'],
['赛季商店-战斗养成','金丝钱袋（通宝）','每周刷新','image23.png','清空体力的主要方式'],
['赛季商店-战斗养成','一盒短陌钱','每周刷新','image12.png','后期如果斗蛐蛐，开封跑商的话不需要买'],
['赛季商店-战斗养成','心法箱子','每周刷新','image21.png','长期每周必买'],
['赛季商店-战斗养成','武学心得','每周刷新','image19.png','长期每周必买'],
['赛季商店-战斗养成','奇术支援箱','每周刷新','image15.png','不想肝奇术升级'],
['赛季商店-装备宝匣','当前阶的装备匣','每周刷新','image3.png','么玉充足，缺装备的时候'],
['赛季商店-金装兑换','当前阶的转律石','每周刷新','image14.png','长期每周必买'],
['赛季商店-金装兑换','当前阶的金妙音石','每周刷新','image16.png','长期每周必买'],
['赛季商店-金装兑换','当前阶的金装自选匣','每周补货，有库存上限','image4.png','能买就买'],
['赛季商店-营生养成','营生手记','每周刷新','image13.png','能买就买，需要提升悬壶/文士的等级来解锁高阶的药品/符帖来提升战斗能力。'],
['赛季商店-外观兑换','袅袅之音','每周刷新','image5.png','度过新手期，买完易水歌之后，可以开始买。'],
['社交商店-江湖行商店','当前阶的止戈定音石','每周刷新','image27.png','按需购买。不玩止戈(pvp)或者百业战可以忽略。'],
['社交商店-江湖行商店','当前阶的止戈变音石','每周刷新','image11.png','按需购买。不玩止戈(pvp)或者百业战可以忽略。'],
['百业-赤金小铺','绕梁之音','每月刷新','image2.png','不换白不换，可以抽外观。'],
['传承商店','奇术支援箱','每周刷新','image29.png','长期每周必买'],
['传承商店','当前阶的变音石','每周补货，剩余库存不清空','image22.png','长期每周必买'],
['传承商店','心法箱子','每周刷新','image8.png','长期每周必买'],
['不错小店','通宝','每周刷新','image25.png','缺通宝可以买'],
['战令商店','当前阶的转律石','每周刷新','image24.png','长期每周必买。注意看准描述是几阶的，别买错了（痛的教训）。因为战令商店所有转律石都有，乱序的。'],
['战令商店','当前阶的变音石','每周刷新','image18.png','同上'],
['战令商店','奇术支援箱','每周刷新','image7.png','长期每周必买'],
['战令商店','不错鸟羽','每期战令刷新','image17.png','建议买。可以到不错小店兑换外观，通宝。'],
['战令商店','等级上限帖','每期战令刷新','image6.png','只有购买了战令的才有意义买。'],
['商店->精选->礼包','通宝','每周刷新','image26.png','免费，记得领'],
['商店->精选->道具->江湖百珍','袅袅之音','每周刷新','image30.png','度过新手期，买完易水歌之后，可以开始买。'],
['商店->和鸣->天精商店','袅袅之音','没有库存限制','image9.png','需要消耗天精。天精是和鸣消耗袅袅之音抽外观时会获得的。'],
['商店->和鸣->地华商店','袅袅之音','每月刷新','image1.png','需要消耗地华。地华是和鸣消耗绕梁之音抽普通外观获得的。'],
['商店->和鸣->地华商店','折音券','每月刷新','image28.png','需要消耗地华。地华是和鸣消耗绕梁之音抽普通外观获得的。如果你需要用长鸣珠（充值/氪金）买外观，有券在手，花钱更少。']
];
function shopTable(){return `<div class="shop-table-wrap"><table class="shop-table"><thead><tr><th>商店</th><th>物品</th><th>刷新频率</th><th>图标</th><th>备注</th></tr></thead><tbody>${shopRows.map(r=>`<tr><td>${escapeHtml(r[0])}</td><td><strong>${escapeHtml(r[1])}</strong></td><td>${escapeHtml(r[2])}</td><td><img src="assets/百科查阅/养成策略/商店必买攻略/${r[3]}" alt="${escapeHtml(r[1])}图标" loading="lazy"></td><td>${escapeHtml(r[4])}</td></tr>`).join('')}</tbody></table></div>`}
const articles={energy:{category:'养成策略',title:'心力消耗策略',text:'心力溢出会造成资源浪费，建议优先安排消耗心力的玩法。以下为原始知识图。',img:'assets/百科查阅/养成策略/心力消耗策略.png',author:'童聪',authorUrl:'https://space.bilibili.com/456111385',source:'https://www.bilibili.com/video/BV1vdr5BiE5j/'},craft:{category:'百科知识',title:'天工知识',text:'天工相关资料与速查说明。以下为原始知识图。',img:'assets/百科查阅/养成策略/天工知识.png',author:'林恩恩恩恩恩恩',authorUrl:'https://space.bilibili.com/431593381',source:'https://www.bilibili.com/video/BV1u6sKz2Efc'},shop:{category:'养成策略',title:'每周商店必买攻略',text:'不知道什么该买？萌新们可以参考这个必买攻略，确保自己至少每个该买的商店都逛过了 😀。商店里面其他物品可以按需购买。',table:true}};
function renderKnowledge(key){const a=articles[key];$$('#knowledge .tree-child[data-article]').forEach(x=>x.classList.toggle('active',x.dataset.article===key));$('#knowledge-article').innerHTML=`<p class="eyebrow">${a.category}</p><h1>${a.title}</h1><p>${a.text}</p>${a.table?shopTable():`<figure><img src="${a.img}" alt="${a.title}知识图" loading="lazy"><figcaption>作者：<a href="${a.authorUrl}" target="_blank" rel="noopener noreferrer">${a.author}</a> · <a href="${a.source}" target="_blank" rel="noopener noreferrer">查看来源</a></figcaption></figure>`}`}
function navigate(page,article){const hash=`#${page}/${article}`;location.hash===hash?route():location.hash=hash}
function renderGuild(key){$$('[data-guild-panel]').forEach(x=>x.classList.toggle('active',x.dataset.guildPanel===key));$$('[data-guild-article]').forEach(x=>x.classList.toggle('active',x.dataset.guildArticle===key));window.scrollTo({top:0,behavior:'auto'})}
$$('[data-article]').forEach(b=>b.addEventListener('click',()=>navigate('knowledge',b.dataset.article)));
$$('[data-guild-article]').forEach(b=>b.addEventListener('click',()=>navigate('guild',b.dataset.guildArticle)));
$$('[data-must-article]').forEach(b=>b.addEventListener('click',()=>navigate('must-do',b.dataset.mustArticle)));
route();render();clock();setInterval(()=>{clock();if(state.period==='Limited')render()},60000);
})();
