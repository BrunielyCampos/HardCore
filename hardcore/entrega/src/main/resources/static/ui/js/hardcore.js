(()=> {
const cookieName='hardcore_session';
const services={usuarios:{name:'Conta',port:8080},entrega:{name:'Entregas',port:8081},produtos:{name:'Loja',port:8082},pedidos:{name:'Pedidos',port:8083}};
const here=location.port||'8080';
const svc=Object.values(services).find(s=>String(s.port)===here)||services.usuarios;
const pages={
usuarios:[
['Conta','/ui/usuarios/cadastro.html','Criar conta','public'],
['Conta','/ui/usuarios/login.html','Entrar','public'],
['Administração','/ui/administrador/usuarios.html','Usuários','ADMIN'],
['Administração','/ui/administrador/entregadores.html','Entregadores','ADMIN,GERENTE'],
['Administração','/ui/administrador/promover-gerente.html','Definir gerente','ADMIN'],
['Administração','/ui/administrador/promover-entregador.html','Definir entregador','ADMIN'],
['Conta','/ui/usuarios/entregadores.html','Entregadores disponíveis','ADMIN,GERENTE'],
['Conta','/ui/usuarios/buscar-por-id.html','Consultar usuário','ADMIN'],
['Conta','/ui/usuarios/validar-entregador.html','Validar entregador','ADMIN,GERENTE']
],
produtos:[
['Catálogo','/ui/produto/listar.html','Produtos','*'],
['Catálogo','/ui/produto/categoria.html','Categorias','*'],
['Catálogo','/ui/produto/marca.html','Marcas','*'],
['Catálogo','/ui/produto/buscar-id.html','Detalhes do produto','*'],
['Catálogo','/ui/produto/por-ids.html','Produtos selecionados','*'],
['Gestão','/ui/produto/cadastrar.html','Novo produto','GERENTE'],
['Gestão','/ui/produto/atualizar.html','Editar produto','GERENTE'],
['Gestão','/ui/produto/deletar.html','Excluir produto','GERENTE'],
['Estoque','/ui/estoque/listar.html','Estoque','*'],
['Estoque','/ui/estoque/por-produto.html','Estoque por produto','*'],
['Estoque','/ui/estoque/quantidade.html','Atualizar quantidade','GERENTE'],
['Estoque','/ui/estoque/cadastrar.html','Cadastrar estoque','GERENTE'],
['Estoque','/ui/estoque/reservar.html','Reservar estoque','GERENTE'],
['Estoque','/ui/estoque/liberar.html','Liberar estoque','GERENTE'],
['Prateleiras','/ui/prateleira/listar.html','Prateleiras','*'],
['Prateleiras','/ui/prateleira/cadastrar.html','Cadastrar prateleira','GERENTE'],
['Prateleiras','/ui/prateleira/por-produto.html','Localizar produto','*'],
['Prateleiras','/ui/prateleira/transferir.html','Transferir produto','GERENTE'],
['Prateleiras','/ui/prateleira/remover.html','Remover produto','GERENTE'],
['Avaliações','/ui/avaliacao/cadastrar.html','Avaliar produto','*'],
['Avaliações','/ui/avaliacao/por-produto.html','Avaliações','*'],
['Avaliações','/ui/avaliacao/buscar-id.html','Consultar avaliação','GERENTE'],
['Avaliações','/ui/avaliacao/listar-ids.html','Avaliações selecionadas','GERENTE'],
['Avaliações','/ui/avaliacao/deletar.html','Excluir avaliação','GERENTE']
],
entrega:[
['Entregas','/ui/entrega/por-pedido.html','Consultar entrega','*'],
['Entregas','/ui/entrega/por-entregador.html','Minhas entregas','ENTREGADOR'],
['Operação','/ui/entrega/atribuir.html','Atribuir entrega','GERENTE'],
['Operação','/ui/entrega/notificar-efetuada.html','Marcar como entregue','ENTREGADOR'],
['Operação','/ui/entrega/confirmar-recebimento.html','Confirmar recebimento','CLIENTE'],
['Operação','/ui/entrega/cancelar.html','Cancelar entrega','GERENTE']
],
pedidos:[
['Pedidos','/ui/pedido/criar.html','Novo pedido','*'],
['Pedidos','/ui/pedido/por-cliente.html','Meus pedidos','*'],
['Pedidos','/ui/pedido/buscar-id.html','Consultar pedido','*'],
['Pedidos','/ui/pedido/cancelar.html','Cancelar pedido','*'],
['Pedidos','/ui/pedido/status.html','Atualizar status','GERENTE'],
['Pedidos','/ui/pedido/entregador.html','Atribuir entregador','GERENTE'],
['Carrinho','/ui/carrinho/criar.html','Meu carrinho','*'],
['Carrinho','/ui/carrinho/por-cliente.html','Consultar carrinho','GERENTE'],
['Carrinho','/ui/itemcarrinho/adicionar.html','Adicionar produto','*'],
['Carrinho','/ui/itemcarrinho/listar.html','Itens do carrinho','*'],
['Carrinho','/ui/itemcarrinho/remover.html','Remover produto','*'],
['Pedidos','/ui/itempedido/listar.html','Itens do pedido','*'],
['Pedidos','/ui/itempedido/buscar-id.html','Consultar item','*'],
['Pagamentos','/ui/abacatepayapi/checkout.html','Pagar pedido','*'],
['Pagamentos','/ui/abacatepayapi/consultar-checkout.html','Consultar pagamento','*'],
['Administração','/ui/abacatepayapi/registrar-webhook.html','Configurar webhook','ADMIN']
]};
function getCookie(){const m=document.cookie.match(new RegExp('(?:^|; )'+cookieName+'=([^;]*)'));return m?decodeURIComponent(m[1]):''}
function setCookie(token){let exp='';try{const p=decode(token);if(p.exp)exp='; expires='+new Date(p.exp*1000).toUTCString()}catch{}document.cookie=cookieName+'='+encodeURIComponent(token)+'; path=/; SameSite=Lax'+exp}
function clearCookie(){document.cookie=cookieName+'=; Max-Age=0; path=/; SameSite=Lax'}
function decode(t){return JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))}
function session(){const token=getCookie();if(!token)return null;try{const p=decode(token);if(p.exp&&p.exp*1000<Date.now()){clearCookie();return null}return {token,role:String(p.perfil||'').replace(/^ROLE_/,'').toUpperCase(),email:p.sub||''}}catch{clearCookie();return null}}
function loginUrl(){return 'http://localhost:8080/ui/usuarios/login.html'}
function homeFor(role){if(role==='ENTREGADOR')return 'http://localhost:8081/';if(role==='ADMIN')return 'http://localhost:8080/';if(role==='GERENTE')return 'http://localhost:8082/';return 'http://localhost:8082/'}
function allowed(rule,role){if(!rule||rule==='*')return true;if(rule==='public')return true;return rule.split(',').includes(role)}
function roleLabel(r){return ({ADMIN:'Administrador',GERENTE:'Gerente',ENTREGADOR:'Entregador',CLIENTE:'Cliente'})[r]||'Visitante'}
const path=location.pathname;
const isLogin=/\/usuarios\/login\.html$|\/administrador\/login\.html$/.test(path);
const isRegister=/\/usuarios\/cadastro\.html$/.test(path);
const sess=session();
if(!isLogin&&!isRegister&&!sess){location.replace(loginUrl());return}
if(isLogin&&sess){location.replace(homeFor(sess.role));return}
const pageForm=document.querySelector('#api-form');
if(pageForm&&sess){
 const method=pageForm.dataset.method||'GET', endpoint=pageForm.dataset.path||'';
 let needed='*';
 if(here==='8080'){if(endpoint.startsWith('/admin/'))needed='ADMIN';else if(endpoint==='/usuarios/entregadores')needed='ADMIN,GERENTE';else if(endpoint.includes('validar-entregador'))needed='ADMIN,GERENTE';else if(endpoint.includes('buscar-por-id'))needed='ADMIN'}
 if(here==='8082'&&method!=='GET'&&!endpoint.includes('/avaliacoes/cadastrar'))needed='GERENTE';
 if(here==='8081'){if(endpoint==='/entregas/atribuir'||endpoint.endsWith('/cancelar'))needed='GERENTE';if(endpoint.endsWith('/notificar-efetuada'))needed='ENTREGADOR';if(endpoint.endsWith('/confirmar-recebimento'))needed='CLIENTE'}
 if(here==='8083'&&endpoint.includes('registrar'))needed='ADMIN';
 if(!allowed(needed,sess.role)){document.body.innerHTML='<main class="auth-wrap"><section class="auth-card"><h1>Acesso não disponível</h1><p class="auth-sub">Seu perfil não possui acesso a esta funcionalidade.</p><a class="btn" href="/">Voltar ao início</a></section></main>';return}
}
function nice(s){return s.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^id$/i,'ID').replace(/^id([A-Z])/,'ID $1').replace(/pix/i,'Chave Pix').replace(/email/i,'E-mail').replace(/senha/i,'Senha').replace(/endereco/i,'Endereço').replace(/quantidade/i,'Quantidade').replace(/preco/i,'Preço').replace(/valorCompra/i,'Valor da compra').replace(/tipoPagamento/i,'Forma de pagamento').replace(/idPedido/i,'Número do pedido').replace(/idCliente/i,'Cliente').replace(/idEntregador/i,'Entregador').replace(/idProduto/i,'Produto').replace(/idPrateleira/i,'Prateleira').replace(/nome/i,'Nome').replace(/marca/i,'Marca').replace(/categoria/i,'Categoria').replace(/dataNascimento/i,'Data de nascimento').replace(/contaBancaria/i,'Conta bancária').replace(/status/i,'Situação').replace(/mensagem/i,'Mensagem')}
function titleFrom(){const h=document.querySelector('.hero h1');return h?.textContent.trim()||document.title.replace('HARDCORE | ','')}
function descFrom(){return document.querySelector('.hero p')?.textContent.trim()||'Gerencie as informações do sistema.'}
function buildShell(content,title,desc){
 document.body.innerHTML=`<header class="appbar"><a class="brand" href="/"><img src="/ui/assets/logo-hardcore.png" alt="">HARD<b>CORE</b></a><div class="bar-right"><span>${sess?roleLabel(sess.role):'Acesso'}</span>${sess?'<span class="role-chip">'+roleLabel(sess.role)+'</span><button class="logout" id="logout">Sair</button>':''}</div></header><div class="app-layout"><aside class="sidebar" id="sidebar"></aside><main class="main"><div class="page-head"><div><div class="eyebrow">${svc.name}</div><h1>${title}</h1><p>${desc}</p></div></div>${content}<div class="foot">HARDCORE</div></main></div>`;
 renderNav();
 document.querySelector('#logout')?.addEventListener('click',()=>{clearCookie();location.href=loginUrl()});
}
function renderNav(){
 const side=document.querySelector('#sidebar');if(!side)return;
 const role=sess?.role||'';
 const all=pages[svc===services.usuarios?'usuarios':svc===services.entrega?'entrega':svc===services.produtos?'produtos':'pedidos']||[];
 let html='<div class="side-title">Sistema</div><a class="side-link" href="http://localhost:8082/">▣ <span>Loja</span></a><a class="side-link" href="http://localhost:8083/">▤ <span>Pedidos</span></a>';
 if(role==='ADMIN'||role==='GERENTE')html+='<a class="side-link" href="http://localhost:8080/">♙ <span>Usuários</span></a>';
 if(role==='ADMIN'||role==='GERENTE'||role==='ENTREGADOR')html+='<a class="side-link" href="http://localhost:8081/">⌁ <span>Entregas</span></a>';
 html+='<div class="side-title">Área atual</div><a class="side-link" href="/">⌂ <span>Início</span></a>';
 let group='';
 all.filter(p=>allowed(p[3],role)).forEach(p=>{if(p[0]!==group){group=p[0];html+=`<div class="side-title">${group}</div>`}html+=`<a class="side-link ${location.pathname===p[1]?'active':''}" href="${p[1]}">${p[2]}</a>`});
 side.innerHTML=html;
}
function showFeedback(msg,type='info'){const el=document.querySelector('#result');if(!el)return;el.textContent=msg;el.className='feedback show '+type}
function prettyMessage(data,fallback){if(typeof data==='string')return data||fallback;if(data&&typeof data==='object'){return data.message||data.mensagem||data.error||data.erro||fallback}return fallback}
function bindForm(newForm){
 newForm.addEventListener('submit',async e=>{
   e.preventDefault();const method=newForm.dataset.method,path=newForm.dataset.path;let endpoint=path;const params=new URLSearchParams();let body={},used=false,raw=null,root=null;
   for(const el of newForm.querySelectorAll('[data-kind]')){let v=el.type==='checkbox'?el.checked:el.value.trim();const kind=el.dataset.kind,key=el.dataset.key;if(kind==='path'&&v!=='' )endpoint=endpoint.replace('{'+key+'}',encodeURIComponent(v));if(kind==='query'&&v!==''){if(key==='ids'&&String(v).includes(','))String(v).split(',').map(a=>a.trim()).filter(Boolean).forEach(a=>params.append(key,a));else params.set(key,v)}if(kind==='body'&&(v!==''||el.type==='checkbox')){body[key]=el.dataset.type==='number'?Number(v):el.dataset.type==='boolean'?v==='true':v;used=true}if(kind==='body-json'&&v){try{body[key]=JSON.parse(v);used=true}catch{return showFeedback('Confira o formato do campo '+nice(key)+'.','error')}}if(kind==='raw-body'&&v!==''){raw=v;used=true}if(kind==='body-root-json'&&v){try{root=JSON.parse(v);used=true}catch{return showFeedback('Confira os dados informados.','error')}}}
   if(endpoint.includes('{'))return showFeedback('Preencha os campos obrigatórios.','error');
   const url=endpoint+(params.toString()?'?'+params.toString():'');const headers={};if(sess?.token)headers.Authorization='Bearer '+sess.token;if(used)headers['Content-Type']='application/json';
   const b=newForm.querySelector('button[type=submit]');if(b){b.disabled=true;b.textContent='Aguarde...'}
   try{const res=await fetch(url,{method,headers,...(used?{body:raw!==null?raw:JSON.stringify(root!==null?root:body)}:{})});const txt=await res.text();let data=null;try{data=txt?JSON.parse(txt):null}catch{data=txt}
    if(res.status===401){clearCookie();return showFeedback('Sua sessão expirou. Entre novamente.','error')}
    if(!res.ok)return showFeedback(prettyMessage(data,'Não foi possível concluir. Verifique os dados e tente novamente.'),'error');
    let msg=method==='GET'?'Informações carregadas com sucesso.':method==='DELETE'?'Registro removido com sucesso.':'Operação concluída com sucesso.';
    if(isLogin){const token=data?.token;if(!token)return showFeedback('A autenticação não retornou uma sessão válida.','error');setCookie(token);const role=decode(token).perfil?.replace(/^ROLE_/,'').toUpperCase();location.href=homeFor(role);return}
    if(isRegister){showFeedback('Conta criada! Agora você já pode entrar.','success');newForm.reset();setTimeout(()=>location.href='/ui/usuarios/login.html',1100);return}
    if(method==='GET'&&Array.isArray(data)){msg=data.length?`${data.length} registro(s) encontrado(s).`:'Nenhum registro encontrado.';showFeedback(msg,'success');renderData(data);return}
    if(method==='GET'&&data&&typeof data==='object'){showFeedback('Informações encontradas.','success');renderData([data]);return}
    showFeedback(prettyMessage(data,msg),'success');
   }catch(err){showFeedback('Não foi possível conectar ao serviço. Confira se ele está disponível.','error')}
   finally{if(b){b.disabled=false;b.textContent=({GET:'Consultar',POST:'Salvar',PUT:'Atualizar',PATCH:'Confirmar',DELETE:'Excluir'})[method]||'Continuar'}}
  });
}
if(isLogin||isRegister){
 const f=pageForm;if(!f)return;
 const admin=path.includes('/administrador/');
 const title=isRegister?'Criar sua conta':(admin?'Acesso administrativo':'Entrar na HARDCORE');
 const intro=isRegister?'Crie sua conta para acompanhar seus pedidos e comprar na HARDCORE.':'Acesse sua conta para continuar.';
 const fields=f.querySelector('.fields')?.outerHTML||'';
 const submitLabel=isRegister?'Criar conta':'Entrar';
 const extra=isRegister?'<div class="auth-links">Já tem uma conta? <a href="/ui/usuarios/login.html">Entrar</a></div>':'<div class="auth-links"><a href="/ui/administrador/login.html">Entrar como administrador</a> · <a href="/ui/usuarios/cadastro.html">Criar conta</a></div>';
 const content=`<div class="auth-wrap"><section class="auth-card"><a class="brand auth-brand" href="/"><img src="/ui/assets/logo-hardcore.png" alt="">HARD<b>CORE</b></a><h1>${title}</h1><p class="auth-sub">${intro}</p><div id="result" class="feedback"></div><form id="api-form" data-method="${f.dataset.method}" data-path="${f.dataset.path}">${fields}<div class="actions"><button class="btn" type="submit">${submitLabel}</button></div></form>${extra}</section></div>`;
 document.body.innerHTML=content;
}else{
 if(pageForm){
  const title=titleFrom(),desc=descFrom();
  const form=pageForm.cloneNode(true);
  form.querySelectorAll('.section').forEach(x=>x.remove());
  form.querySelectorAll('.actions button[type=reset]').forEach(x=>x.remove());
  const btn=form.querySelector('button[type=submit]');if(btn)btn.textContent=({GET:'Consultar',POST:'Salvar',PUT:'Atualizar',PATCH:'Confirmar',DELETE:'Excluir'})[form.dataset.method]||'Continuar';
  form.querySelectorAll('.field label').forEach(l=>{l.textContent=nice(l.textContent.trim())});
  form.querySelectorAll('input[placeholder]').forEach(i=>{if(i.type!=='password')i.placeholder='Informe '+nice(i.dataset.key||'o valor').toLowerCase()});
  form.querySelectorAll('.field').forEach(x=>{if(x.querySelector('input[type=checkbox]'))x.classList.add('check-field')});
  const content=`<section class="panel"><form id="api-form" data-method="${form.dataset.method}" data-path="${form.dataset.path}">${form.innerHTML}</form><div id="result" class="feedback" role="status" aria-live="polite"></div></section>`;
  buildShell(content,title,desc);
  const newForm=document.querySelector('#api-form');
  bindForm(newForm);
 }else{
  const title=titleFrom()||svc.name,desc=descFrom()||'Bem-vindo ao sistema HARDCORE. Escolha uma área para continuar.';
  const cards=(pages[svc===services.usuarios?'usuarios':svc===services.entrega?'entrega':svc===services.produtos?'produtos':'pedidos']||[]).filter(p=>allowed(p[3],sess?.role));
  const content=`<section class="welcome"><h2>Olá, ${sess?.email?.split('@')[0]||'bem-vindo'}!</h2><p>Seu ambiente está pronto. As opções abaixo respeitam o perfil da sua conta.</p></section><div class="cards">${cards.map(p=>`<a class="action-card" href="${p[1]}"><strong>${p[2]}</strong><span>${p[0]}</span></a>`).join('')}</div>`;
  buildShell(content,title,desc);
 }
}
if(isLogin||isRegister){const authForm=document.querySelector('#api-form');if(authForm)bindForm(authForm)}
function renderData(rows){const old=document.querySelector('#data-view');old?.remove();const box=document.createElement('div');box.id='data-view';box.className='panel';box.style.marginTop='18px';const keys=[...new Set(rows.flatMap(o=>Object.keys(o||{})))].filter(k=>!['senha','token'].includes(k.toLowerCase()));if(!keys.length){box.textContent='Nenhum dado para exibir.'}else{const table=document.createElement('div');table.style.overflowX='auto';const t=document.createElement('table');t.style.width='100%';t.style.borderCollapse='collapse';const th=document.createElement('tr');keys.forEach(k=>{const c=document.createElement('th');c.textContent=nice(k);c.style.cssText='text-align:left;padding:10px;border-bottom:1px solid #444;color:#aaa;font-size:12px';th.appendChild(c)});t.appendChild(th);rows.forEach(r=>{const tr=document.createElement('tr');keys.forEach(k=>{const c=document.createElement('td');c.textContent=typeof r[k]==='object'?JSON.stringify(r[k]):String(r[k]??'—');c.style.cssText='padding:11px 10px;border-bottom:1px solid #292929;font-size:13px';tr.appendChild(c)});t.appendChild(tr)});table.appendChild(t);box.appendChild(table)}document.querySelector('.panel')?.after(box)}
})();