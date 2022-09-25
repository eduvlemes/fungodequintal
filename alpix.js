
let theme = [];

theme.menu =  [
    {title: 'Sobre a Fungo', link:'', target:'', children : ['Nossa História','Benefícios','Gastronomia','Lifestyle da Fungo', 'Pequenos Produtores'] },
    {title: 'Clube de Assinaturas' , link:'', target:''},
    {title: 'Compras Avulsas',  link:'', target:'', type: 'categories'},
    {title: 'Food Service',  link:'', target:''},
    {title: 'Blog',  link:'', target:'_blank'},
];

theme.resources = []
theme.resources.json = {};

theme.resources.json.social = $('.barra-inicial .lista-redes a').map(function(i){
    return {
        name : $(this).find('i').attr('class').replace('icon-','').trim(),
        url : $(this).attr('href')        
    };
}).get();

theme.resources.json.categories = $('.menu.superior [class^="categoria-id-"] a').map(function(i){
    return {
        name : $(this).text().trim(),
        url : $(this).attr('href'),
        level : $(this).closest('ul').attr('class').replace('borda-alpha','').trim(),
        id : $(this).closest('li').attr('class').replace('borda-principal','').replace('com-filho','').trim(),
        parent : !$(this).closest('ul').attr('class').includes('nivel-um') ? $(this).closest('ul').closest('li').attr('class').replace('borda-principal','').replace('com-filho','').trim() : null
    };
}).get();

theme.resources.json.pages = $('.links-rodape-paginas a').map(function(i){
    return {
        name : $(this).text().trim(),
        url : $(this).attr('href')        
    };
}).get();


$('body:not(.pagina-inicial) #barraNewsletter.posicao-rodape').remove();
$(document).ready(function(){
    $('.pagina-categoria h1.titulo, .pagina-busca h1.titulo, .pagina-marca h1.titulo').prependTo('.conteudo.span9'); 
    $('.pagina-categoria h1.titulo, .pagina-busca h1.titulo, .pagina-marca h1.titulo, .ordenar-listagem.topo').wrapAll('<div class="apx_ajustaTopoCategoria"></div>');
});

//BUY ON LIST WITH VARIANT
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};


let variacoes_lista = ['sabor da massa'];

function makeForm(el,product_id,form){
    if(el.find('.apx_addOnList').length == 0){
        el.find('.acoes-produto, .acoes-produto-responsiva').remove();
        let elGrid = $('<div class="apx_addOnList"></div>').append($(form));
        if(elGrid.find('ul').length == 0){
            elGrid.find('li').wrapAll('<ul></ul>');
        }
        el.append(elGrid);
        el.append('<a href="' + el.find('.nome-produto').attr('href') + '">Ver Produto</a>');
        let opcao = el.find('.atributos > div > span > b').text().toLowerCase().trim();
        if(variacoes_lista.includes(opcao)){            
            el.find('.atributos .atributo-item').unwrap().unwrap();
            el.find('.atributos .atributo-item').each(function(index) {
                var thisTD = this;
                var newElement = $("<option>"+ $(this).text() +"</option>");
                $.each(this.attributes, function(index) {
                  $(newElement).attr(thisTD.attributes[index].name, thisTD.attributes[index].value);
                });
                $(this).after(newElement).remove();
            });
            el.find('option').wrapAll('<select class="apx_listOption"></select>');
            el.find('select').prepend('<option style="display:none" selected>Selecione a opção de '+ opcao +'...</option>')
            //el.find('.atributos .atributo-item').unwrap();
            //el.find('.atributos ul').replaceTagName('<select></select>');
        }
        
    }
};





$(window).load(function(){
    $(window).on('resize scroll', function() {
        $('.listagem-item:not(.loaded)').each(function(){
            let me = $(this);
            let product_id = me.find('.trustvox-stars').attr('data-trustvox-product-code');
            let formSession = sessionStorage.getItem('form_' + product_id);
            //console.log(formSession)
            if(formSession == null){
                if (me.isInViewport()) {
                    $.get($(this).find('.nome-produto').attr('href'), function(data){
                        let form = $('<div id="'+ $(data).find('[itemprop="sku"]').text().trim() +'"></div>');
                        form.append($(data).find('.atributos'));
                        form.append($(data).find('.span5 .acoes-produto[data-produto-id]'));

                        formSession = form.html();
                        sessionStorage.setItem('form_' + product_id, formSession);                    
                        makeForm(me,product_id,formSession);    
                        me.addClass('loaded');
                    });
                }
            }else{
                if(!me.hasClass('loaded')){
                    if(formSession.status != false){
                        makeForm(me,product_id,formSession);    
                    }
                    me.addClass('loaded');
                }
            }
        });

        $('body').on('click','.apx_addOnList .atributos a', function(){
            let vid = $(this).attr('data-variacao-id');
            $(this).closest('.apx_addOnList').find('.atributos a').removeClass('active');
            $(this).addClass('active');
            $(this).closest('.apx_addOnList').find('.acoes-produto').addClass('hide');
            $(this).closest('.apx_addOnList').find('.acoes-produto[data-variacao-id="'+ vid +'"]').removeClass('hide');
        });

        $('body').on('change','.apx_addOnList .atributos select', function(){
            let vid = $(this).find('option:selected').attr('data-variacao-id');
            $(this).closest('.apx_addOnList').find('.atributos a').removeClass('active');
            $(this).addClass('active');
            $(this).closest('.apx_addOnList').find('.acoes-produto').addClass('hide');
            $(this).closest('.apx_addOnList').find('.acoes-produto[data-variacao-id="'+ vid +'"]').removeClass('hide');
        });
    });    
})
let menu = [];
let selos = [];
//CONTENT FROM "FULLBANNERS" ON LI PANEL
$('.secao-banners .banner.cheio img').each(function(){
    let trigger = $(this).attr('alt');   
    
    if(trigger.includes('[apx]')){
        if(trigger.includes('[menu]')){
            menu.push({ title : $(this).closest('li').text().trim(), url : $(this).closest('li').find('a').attr('href')});
        }    
    }
    
    //TESTIMONIALS SLIDER
    if(trigger.includes('[item-depoimento]')){
        if($('#theme_testimonialSlider').length == 0){
            $('<div id="theme_testimonialSlider" class="listagem"><div class="titulo-categoria cor-principal"><i class="svg-ico cor-principal">'+ theme.icon.testimonials +'</i><strong>'+ theme.lang.testimonialsTitle +'</strong></div><div class="slides"></div></div>').prependTo('#corpo > .conteiner');
        }
        $(this).closest('li').appendTo('#theme_testimonialSlider > .slides'); 
        return true;
    }

    //SET LABEL ON PRODUCT WITH SPECIFIC CATEGORY ID
    if(trigger.includes('[selo-produto:')){
        let regExp = /\[selo-produto:(.*?)\]/;
        let target = regExp.exec(trigger);
        let removeAfter = $(this).closest('li');
        selos.push({target: target[1], src: $(this).attr('src')});
        removeAfter.remove();    
    }

    //REDUCE IMAGES WHEN HAS A MOBILE VIEW
    if(!trigger.includes('[mobile]') && theme.isMobile){
        $(this).closest('li').remove();                        
    }
    if(trigger.includes('[mobile]') && !theme.isMobile){
        $(this).closest('li').remove();                        
    }

    //SET TOPBAR SLIDER
    if(trigger.includes('[item-tarja-topo]')){
        let removeAfter = $(this).closest('li');
        
        if($('#theme_topbarSlider').length == 0){
            $('#cabecalho').before('<div class="theme_topbarSlider" id="theme_topbarSlider"></div>');
        }
        $(this).closest('li').appendTo('#theme_topbarSlider');
    }
});

$(document).ready(function(){
    $('#cabecalho .nivel-um').empty();
    $.each(menu,function(k,v){
        let i = $('<li class="titulo1 new"><a href="'+ v.url +'"><strong class="titulo2">'+ v.title +'</strong></a></li>');
        let exists = theme.resources.json.categories.find(el => el.name.toLowerCase().trim() == v.title.toLowerCase().trim());
        //console.log(exists);
        if(exists){
            let child = theme.resources.json.categories.filter(el => el.parent != null && el.parent.trim() == exists.id.trim());
            if(child){
                let ul = $('<ul class="newDropdown"></ul>');
                $.each(child,function(k2, v2){
                    ul.append('<li><a href="'+ v2.url +'">'+ v2.name +'</a></li>')    
                });
                i.addClass('hasChildren');
                i.append(ul);
            }            
        }
        $('#cabecalho .nivel-um').append(i);
    });

    if(window.innerWidth < 990){
        $('body').on('click','.titulo1.new.hasChildren > a', function(e){
            e.preventDefault();
            $(this).closest('li').toggleClass('open');
        })
    }
    
});

if($('.banner.cheio img').length  == 0){
    $('.banner.cheio').remove()
}
if($('.secao-banners img').length  == 0){
    $('.secao-banners').remove()
}

$('body:not(.pagina-inicial) .banner.tarja').remove();
