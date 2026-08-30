import { readFile, writeFile } from 'node:fs/promises';
import gettextParser from 'gettext-parser';

const translations = {
	'WP Definitivo': 'WP Definitivo',
	'https://wpdefinitivo.com/tema-wp-definitivo/': 'https://wpdefinitivo.com/tema-wp-definitivo/',
	'An accessible, content-first classic theme with an organic editorial style for creators and small businesses.': 'Um tema clássico acessível, orientado a conteúdo e com estilo editorial orgânico para criadores e pequenos negócios.',
	'https://wpdefinitivo.com/': 'https://wpdefinitivo.com/',
	'Error 404': 'Erro 404',
	'That page could not be found.': 'Essa página não foi encontrada.',
	'It may have moved or no longer exists. Try a search or return to the home page.': 'Ela pode ter sido movida ou não existir mais. Tente pesquisar ou volte à página inicial.',
	'Return home': 'Voltar ao início',
	'Download attachment': 'Baixar anexo',
	'Older comments': 'Comentários mais antigos',
	'Newer comments': 'Comentários mais recentes',
	'Comments are closed.': 'Os comentários estão encerrados.',
	'Theme by %s.': 'Tema por %s.',
	'Footer menu': 'Menu do rodapé',
	'Latest posts': 'Posts mais recentes',
	'Skip to content': 'Pular para o conteúdo',
	'Menu': 'Menu',
	'Primary menu': 'Menu principal',
	'Open menu': 'Abrir menu',
	'Close menu': 'Fechar menu',
	'Open search': 'Abrir pesquisa',
	'Close search': 'Fechar pesquisa',
	'Definitivo outline': 'Contorno Definitivo',
	'Organic quote': 'Citação orgânica',
	'Framed': 'Emoldurada',
	'Soft panel': 'Painel suave',
	'Choose a valid hexadecimal color.': 'Escolha uma cor hexadecimal válida.',
	'The accent must have a contrast ratio of at least 4.5:1 against the selected scheme surfaces and button text.': 'O destaque deve ter uma taxa de contraste de pelo menos 4,5:1 em relação às superfícies e ao texto dos botões do esquema selecionado.',
	'Theme options': 'Opções do tema',
	'Presentation controls for WP Definitivo.': 'Controles de apresentação do WP Definitivo.',
	'Color scheme': 'Esquema de cores',
	'Custom accent': 'Destaque personalizado',
	'Optional. The color is saved only when it maintains WCAG AA contrast against the selected scheme surfaces and button text.': 'Opcional. A cor só é salva quando mantém contraste WCAG AA em relação às superfícies e ao texto dos botões do esquema selecionado.',
	'Header': 'Cabeçalho',
	'Keep the header visible while scrolling': 'Manter o cabeçalho visível durante a rolagem',
	'Show search in the header': 'Mostrar pesquisa no cabeçalho',
	'Show cart in the header': 'Mostrar carrinho no cabeçalho',
	'Typography': 'Tipografia',
	'Choose which typography settings to configure.': 'Escolha quais configurações de tipografia deseja ajustar.',
	'Theme typography': 'Tipografia do tema',
	'Typography settings for pages, posts, navigation, and widgets.': 'Configurações de tipografia para páginas, posts, navegação e widgets.',
	'WooCommerce typography': 'Tipografia do WooCommerce',
	'Typography settings for the store, products, cart, checkout, and account pages.': 'Configurações de tipografia para a loja, produtos, carrinho, finalização de compra e páginas da conta.',
	'System UI': 'Interface do sistema',
	'Arial': 'Arial',
	'Trebuchet MS': 'Trebuchet MS',
	'Body font': 'Fonte do corpo',
	'Heading font': 'Fonte dos títulos',
	'Base text size': 'Tamanho base do texto',
	'Controls paragraph and interface text across the theme.': 'Controla o texto de parágrafos e da interface em todo o tema.',
	'Heading scale': 'Escala dos títulos',
	'Controls the size of headings across pages, posts, and cards.': 'Controla o tamanho dos títulos em páginas, posts e cartões.',
	'WooCommerce text size': 'Tamanho do texto do WooCommerce',
	'Controls descriptions, forms, cart, checkout, and account text.': 'Controla textos de descrições, formulários, carrinho, finalização de compra e conta.',
	'WooCommerce heading scale': 'Escala dos títulos do WooCommerce',
	'Controls product, product card, cart, checkout, and account headings.': 'Controla títulos de produtos, cartões de produtos, carrinho, finalização de compra e conta.',
	'Compact': 'Compacto',
	'Standard': 'Padrão',
	'Layout options for standard pages.': 'Opções de layout para páginas padrão.',
	'Blog': 'Blog',
	'Layout options for the posts page, archives, and search results.': 'Opções de layout para a página de posts, arquivos e resultados de pesquisa.',
	'Post': 'Post',
	'Layout and content options for individual posts.': 'Opções de layout e conteúdo para posts individuais.',
	'Store': 'Loja',
	'Container width': 'Largura do contêiner',
	'Sets the maximum width of the content and optional sidebar. The page hero keeps its standard width.': 'Define a largura máxima do conteúdo e da barra lateral opcional. O topo da página mantém a largura padrão.',
	'Compact (1080 px)': 'Compacto (1080 px)',
	'Medium (1200 px)': 'Médio (1200 px)',
	'Wide (1440 px)': 'Amplo (1440 px)',
	'Choose a WooCommerce page to configure its container and sidebar.': 'Escolha uma página do WooCommerce para configurar seu contêiner e sua barra lateral.',
	'Store Page': 'Página da loja',
	'Layout options for the main store, product categories, product tags, and product search results.': 'Opções de layout para a loja principal, categorias de produtos, tags de produtos e resultados de pesquisa de produtos.',
	'Layout options for individual WooCommerce products.': 'Opções de layout para produtos individuais do WooCommerce.',
	'Layout options for the WooCommerce cart page.': 'Opções de layout para a página do carrinho do WooCommerce.',
	'Checkout': 'Finalização de compra',
	'Layout options for checkout and order confirmation.': 'Opções de layout para a finalização de compra e a confirmação do pedido.',
	'My Account': 'Minha conta',
	'Layout options for the account dashboard, orders, downloads, addresses, account details, and lost password views.': 'Opções de layout para o painel da conta, pedidos, downloads, endereços, detalhes da conta e recuperação de senha.',
	'Show store hero': 'Mostrar a seção de destaque da loja',
	'Templates for WordPress': 'Templates para WordPress',
	'Hero label': 'Rótulo da seção de destaque',
	'Leave blank to hide the label. The title and description come from the store page.': 'Deixe em branco para ocultar o rótulo. O título e a descrição vêm da página da loja.',
	'Show hero background decoration': 'Mostrar a decoração de fundo da seção de destaque',
	'Product': 'Produto',
	'Individual product': 'Produto individual',
	'Sidebar layouts': 'Layouts das barras laterais',
	'Choose a sidebar position for each area. Sidebars are shown only when they contain widgets.': 'Escolha a posição da barra lateral para cada área. As barras laterais são exibidas somente quando contêm widgets.',
	'No sidebar': 'Sem barra lateral',
	'Pages': 'Páginas',
	'Single posts': 'Posts individuais',
	'Blog, archives and search': 'Blog, arquivos e pesquisa',
	'WooCommerce store and product archives': 'Loja e arquivos de produtos do WooCommerce',
	'Content and layout': 'Conteúdo e layout',
	'Right': 'Direita',
	'Left': 'Esquerda',
	'Sidebar position': 'Posição da barra lateral',
	'The sidebar is displayed only when its widget area contains widgets.': 'A barra lateral é exibida somente quando sua área de widgets contém widgets.',
	'Archive layout': 'Layout dos arquivos',
	'List': 'Lista',
	'Grid': 'Grade',
	'Grid columns': 'Colunas da grade',
	'The three-column layout is not compatible with a sidebar. Select No sidebar to enable it.': 'O layout de três colunas não é compatível com uma barra lateral. Selecione Sem barra lateral para habilitá-lo.',
	'Two': 'Duas',
	'Three': 'Três',
	'Four': 'Quatro',
	'Product grid columns': 'Colunas da grade de produtos',
	'Choose the number of products displayed in each row of the store catalog.': 'Escolha quantos produtos serão exibidos em cada linha do catálogo da loja.',
	'Product thumbnail shape': 'Formato das miniaturas dos produtos',
	'Choose the image proportion used by product cards in the store catalog.': 'Escolha a proporção das imagens usada nos cartões de produtos do catálogo da loja.',
	'Product image shape': 'Formato da imagem do produto',
	'Choose the proportion of the main image on individual product pages.': 'Escolha a proporção da imagem principal nas páginas de produtos individuais.',
	'Availability': 'Disponibilidade',
	'Price on request': 'Preço sob consulta',
	'Contact us to receive availability and a personalized proposal for this product.': 'Entre em contato para receber informações sobre disponibilidade e uma proposta personalizada para este produto.',
	'Original': 'Original',
	'Square': 'Quadrado',
	'Vertical (4:5)': 'Vertical (4:5)',
	'Show product description': 'Mostrar descrição do produto',
	'Displays the short product description in store catalog cards.': 'Exibe a descrição curta do produto nos cartões do catálogo da loja.',
	'Posts on archive pages': 'Posts nas páginas de arquivo',
	'Excerpt': 'Resumo',
	'Full content': 'Conteúdo completo',
	'Show featured images': 'Mostrar imagens destacadas',
	'Show post metadata': 'Mostrar metadados do post',
	'Footer': 'Rodapé',
	'Footer text': 'Texto do rodapé',
	'Edit the text directly. Use [current_year] and [site_title] for dynamic values. Basic links and emphasis are allowed.': 'Edite o texto diretamente. Use [current_year] e [site_title] para valores dinâmicos. Links básicos e ênfase são permitidos.',
	'Copyright © [current_year] [site_title].': 'Copyright © [current_year] [site_title].',
	'Copyright © [current_year] [site_title]. <a href="https://wpdefinitivo.com/">Theme by WP Definitivo.</a>': '© [current_year] [site_title]. <a href="https://wpdefinitivo.com/">Tema por WP Definitivo.</a>',
	'Show “Theme by WP Definitivo” credit': 'Mostrar o crédito “Tema por WP Definitivo”',
	'Shop sidebar': 'Barra lateral da loja',
	'Product sidebar': 'Barra lateral do produto',
	'Search products': 'Pesquisar produtos',
	'Product categories': 'Categorias de produtos',
	'Cart': 'Carrinho',
	'Blog and archives sidebar': 'Barra lateral do blog e arquivos',
	'Shown on single posts, the blog, archives, and search results when enabled in the Customizer and populated with widgets.': 'Exibida nos posts individuais, blog, arquivos e resultados de pesquisa quando ativada no Personalizador e preenchida com widgets.',
	'Pages sidebar': 'Barra lateral das páginas',
	'Shown on pages when enabled in the Customizer and populated with widgets.': 'Exibida nas páginas quando ativada no Personalizador e preenchida com widgets.',
	'The store sidebar displays product search and categories when its widget area is empty.': 'A barra lateral da loja exibe a pesquisa e as categorias de produtos quando sua área de widgets está vazia.',
	'Shared by WooCommerce layouts when their sidebar is enabled. Added widgets replace the theme fallback.': 'Compartilhada pelos layouts do WooCommerce quando a barra lateral está ativada. Os widgets adicionados substituem o conteúdo inicial do tema.',
	'Ivory and wine': 'Marfim e vinho',
	'Sand and green': 'Areia e verde',
	'Night and wine': 'Noite e vinho',
	'Published': 'Publicado',
	' by %s': ' por %s',
	', ': ', ',
	'Filed under %s': 'Arquivado em %s',
	'Tagged %s': 'Marcado com %s',
	'Leave a comment': 'Deixe um comentário',
	'1 comment': '1 comentário',
	'% comments': '% comentários',
	'Edit': 'Editar',
	'Landing page': 'Página de destino',
	'Page with sidebar': 'Página com barra lateral',
	'Search results for: %s': 'Resultados da pesquisa por: %s',
	'Search for:': 'Pesquisar por:',
	'Search…': 'Pesquisar…',
	'Search': 'Pesquisar',
	'Sidebar': 'Barra lateral',
	'Previous': 'Anterior',
	'Next': 'Próximo',
	'Nothing found': 'Nada encontrado',
	'No results matched your search. Try different keywords.': 'Nenhum resultado correspondeu à sua pesquisa. Tente palavras diferentes.',
	'There is no content here yet.': 'Ainda não há conteúdo aqui.',
	'Page': 'Página',
	'Breadcrumb': 'Trilha de navegação',
	'Home': 'Início',
	'Updated on %s': 'Atualizado em %s',
	'White and navy': 'Branco e azul-marinho',
	'Canvas': 'Plano de fundo',
	'Container': 'Contêiner',
	'Card': 'Cartão',
	'Navy': 'Azul-marinho',
	'Deep blue': 'Azul profundo',
	'Blue': 'Azul',
	'Ivory': 'Marfim',
	'Charcoal': 'Carvão',
	'Wine': 'Vinho',
	'Rose': 'Rosa',
	'Sand': 'Areia',
	'Forest': 'Floresta',
	'Night': 'Noite',
	'2XS': '2PP',
	'XS': 'PP',
	'Small': 'Pequeno',
	'Medium': 'Médio',
	'Large': 'Grande',
	'XL': 'GG',
	'Inter': 'Inter',
	'JetBrains Mono': 'JetBrains Mono',
	'Extra large': 'Extra grande',
	'Display': 'Destaque',
};

const plurals = {
	'%1$s comment on “%2$s”': [ '%1$s comentário em “%2$s”', '%1$s comentários em “%2$s”' ],
	'%s item in cart': [ '%s item no carrinho', '%s itens no carrinho' ],
};

const potPath = 'wp-definitivo/languages/wp-definitivo.pot';
const poPath = 'wp-definitivo/languages/pt_BR.po';
const moPath = 'wp-definitivo/languages/pt_BR.mo';
const catalog = gettextParser.po.parse( await readFile( potPath ) );
const missingTranslations = [];

catalog.headers.language = 'pt_BR';
catalog.headers['plural-forms'] = 'nplurals=2; plural=(n > 1);';
catalog.headers['language-team'] = 'Portuguese (Brazil)';
catalog.headers['last-translator'] = 'Leandro Biffi <contato@wpdefinitivo.com>';
catalog.headers['po-revision-date'] = '2026-08-28 22:15-0300';

for ( const context of Object.values( catalog.translations ) ) {
	for ( const [ msgid, entry ] of Object.entries( context ) ) {
		if ( '' === msgid ) {
			continue;
		}

		if ( entry.msgid_plural ) {
			if ( ! Object.hasOwn( plurals, msgid ) ) {
				missingTranslations.push( msgid );
				continue;
			}
			entry.msgstr = plurals[ msgid ];
			continue;
		}

		if ( ! Object.hasOwn( translations, msgid ) ) {
			missingTranslations.push( msgid );
			continue;
		}
		entry.msgstr = [ translations[ msgid ] ];
	}
}

if ( missingTranslations.length ) {
	throw new Error( `Missing pt_BR translations:\n${ [ ...new Set( missingTranslations ) ].join( '\n' ) }` );
}

const po = gettextParser.po.compile( catalog );
const mo = gettextParser.mo.compile( catalog );
await writeFile( poPath, po );
await writeFile( moPath, mo );

console.log( `Generated ${ poPath } and ${ moPath } with complete pt_BR translations.` );
