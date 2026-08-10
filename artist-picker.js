(function(){
  "use strict";
  const cache=new Map();
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normal=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
  const wait=(fn,delay=250)=>{let timer;return(...args)=>{clearTimeout(timer);timer=setTimeout(()=>fn(...args),delay)}};
  async function catalogueJson(response,label){
    const text=await response.text();
    if(!response.ok)throw Error(`${label} is temporarily unavailable (${response.status}).`);
    try{return JSON.parse(text)}catch{throw Error(`${label} returned an unexpected webpage. Refresh once; if it continues, check that the latest website files were uploaded.`)}
  }

  async function search(query){
    query=String(query||'').trim();if(query.length<2)return[];
    const key=normal(query);if(cache.has(key))return cache.get(key);
    const response=await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=musicArtist&attribute=artistTerm&limit=12&country=US`);
    const data=await catalogueJson(response,'Artist search'),seen=new Set();
    const results=(data.results||[]).filter(item=>item.artistId&&item.artistName&&!seen.has(item.artistId)&&seen.add(item.artistId)).map(item=>({id:String(item.artistId),name:item.artistName,genre:item.primaryGenreName||'Artist',url:item.artistLinkUrl||''}));
    results.sort((a,b)=>(normal(a.name)===key?-1:normal(b.name)===key?1:normal(a.name).startsWith(key)?-1:normal(b.name).startsWith(key)?1:a.name.localeCompare(b.name)));
    cache.set(key,results);return results;
  }

  async function resolve(name){
    const results=await search(name),key=normal(name);return results.find(x=>normal(x.name)===key)||results[0]||null;
  }

  async function tracks(selection,limit=100){
    let artist=typeof selection==='string'?await resolve(selection):selection;
    if(!artist?.id)artist=await resolve(artist?.name||'');
    if(!artist?.id)throw Error(`Artist “${artist?.name||selection}” was not found. Choose an artist from the dropdown.`);
    const response=await fetch(`https://itunes.apple.com/lookup?id=${encodeURIComponent(artist.id)}&entity=song&limit=${Math.min(200,limit)}&country=US`);
    const data=await catalogueJson(response,`Songs by ${artist.name}`);
    return(data.results||[]).filter(item=>item.wrapperType==='track'&&item.kind==='song'&&String(item.artistId)===String(artist.id)&&item.trackName).map(item=>({name:item.trackName,sub:item.artistName,artist:item.artistName,artistId:String(item.artistId),year:Number(String(item.releaseDate||'').slice(0,4))||2000,explicit:item.trackExplicitness==='explicit',art:item.artworkUrl100?.replace('100x100','400x400')||'',preview:item.previewUrl||'',storeUrl:item.trackViewUrl||''}));
  }

  function attach(input,{multiple=false,onSelect=null}={}){
    if(!input||input.dataset.artistPicker==='yes')return null;input.dataset.artistPicker='yes';
    const host=input.closest('.artist-row,.artist-search-host')||input.parentElement;host.classList.add('artist-picker-host');
    const menu=document.createElement('div');menu.className='artist-suggestions hidden';menu.setAttribute('role','listbox');host.append(menu);
    let items=[],active=-1;
    const close=()=>{menu.classList.add('hidden');active=-1};
    const choose=item=>{input.value=item.name;input.dataset.artistId=item.id;input.dataset.artistName=item.name;close();input.dispatchEvent(new CustomEvent('artistselected',{bubbles:true,detail:item}));if(onSelect)onSelect(item,input,multiple)};
    const render=(results,query)=>{items=results;active=-1;menu.innerHTML=`<div class="artist-query-row"><span>⌕</span><b>Search for “${esc(query)}”</b></div>${results.length?results.map((item,index)=>`<button type="button" role="option" data-index="${index}"><span class="artist-avatar">${esc(item.name.charAt(0).toUpperCase())}</span><span><b>${esc(item.name)}</b><small>${esc(item.genre)}</small></span><em>Artist</em></button>`).join(''):'<p>No matching artists found.</p>'}`;menu.classList.remove('hidden');menu.querySelectorAll('button').forEach(button=>button.onpointerdown=event=>{event.preventDefault();choose(results[Number(button.dataset.index)])})};
    const run=wait(async()=>{const query=input.value.trim();if(query.length<2)return close();input.removeAttribute('data-artist-id');input.removeAttribute('data-artist-name');menu.innerHTML='<p>Searching artists…</p>';menu.classList.remove('hidden');try{render(await search(query),query)}catch(error){menu.innerHTML=`<p>${esc(error.message)}</p>`}},220);
    input.addEventListener('input',run);input.addEventListener('focus',()=>{if(input.value.trim().length>=2)run()});input.addEventListener('blur',()=>setTimeout(close,120));
    input.addEventListener('keydown',event=>{const buttons=[...menu.querySelectorAll('button')];if(!buttons.length)return;if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();active=(active+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons.forEach((button,index)=>button.classList.toggle('active',index===active));buttons[active].scrollIntoView({block:'nearest'})}else if(event.key==='Enter'&&active>=0){event.preventDefault();choose(items[active])}else if(event.key==='Escape')close()});
    return{select:choose,close};
  }

  function get(input){return{name:input.dataset.artistName||input.value.trim(),id:input.dataset.artistId||''}}
  window.ArtistPicker={attach,search,resolve,tracks,get,normal};
})();
