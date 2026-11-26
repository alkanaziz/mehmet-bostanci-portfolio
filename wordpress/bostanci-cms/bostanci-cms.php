<?php
/**
 * Plugin Name:       Bostanci CMS
 * Description:       Headless CMS for bostanci-art.de: artworks (Eserler), site settings, menu, automatic site rebuild via GitHub Actions.
 * Version:           1.0.3
 * Requires at least: 6.5
 * Requires PHP:      8.1
 * License:           GPL-2.0-or-later
 *
 * The admin UI is in Turkish on purpose: it is used by the artist.
 *
 * Optional constants in wp-config.php (enable automatic rebuilds):
 *   define( 'BOSTANCI_GITHUB_REPO', 'owner/repo' );
 *   define( 'BOSTANCI_GITHUB_TOKEN', '...' ); // fine-grained token, Contents: read & write on that repo only
 */

defined( 'ABSPATH' ) || exit;

const BOSTANCI_PUBLIC_SITE = 'https://bostanci-art.de';
const BOSTANCI_SETTINGS    = 'bostanci_site_settings';
const BOSTANCI_STATUS      = 'bostanci_rebuild_status';

/* -------------------------------------------------------------------------
 * 1. Content model: artworks, categories, group code, menu location
 * ---------------------------------------------------------------------- */

add_action( 'init', 'bostanci_register_content' );

function bostanci_register_content() {
	register_post_type(
		'eser',
		array(
			'labels'        => array(
				'name'                  => 'Eserler',
				'singular_name'         => 'Eser',
				'menu_name'             => 'Eserler',
				'all_items'             => 'Tüm eserler',
				'add_new'               => 'Yeni eser ekle',
				'add_new_item'          => 'Yeni eser ekle',
				'edit_item'             => 'Eseri düzenle',
				'new_item'              => 'Yeni eser',
				'search_items'          => 'Eser ara',
				'not_found'             => 'Eser bulunamadı',
				'not_found_in_trash'    => 'Çöp kutusunda eser yok',
				'featured_image'        => 'Eser görseli',
				'set_featured_image'    => 'Eser görselini seç',
				'remove_featured_image' => 'Görseli kaldır',
				'use_featured_image'    => 'Eser görseli olarak kullan',
			),
			'public'        => false,
			'show_ui'       => true,
			'show_in_menu'  => true,
			'show_in_rest'  => true,
			'rest_base'     => 'eserler',
			'menu_position' => 5,
			'menu_icon'     => 'dashicons-format-image',
			// page-attributes exposes menu_order (the sort order) and custom-fields exposes
			// meta.grup_kodu in the REST API. Their editor boxes are removed below.
			'supports'      => array( 'title', 'thumbnail', 'page-attributes', 'custom-fields' ),
		)
	);

	register_taxonomy(
		'eser_kategori',
		'eser',
		array(
			'labels'            => array(
				'name'          => 'Kategoriler',
				'singular_name' => 'Kategori',
				'menu_name'     => 'Kategoriler',
				'all_items'     => 'Tüm kategoriler',
				'add_new_item'  => 'Yeni kategori ekle',
				'edit_item'     => 'Kategoriyi düzenle',
				'search_items'  => 'Kategori ara',
				'not_found'     => 'Kategori bulunamadı',
			),
			'public'            => false,
			'show_ui'           => true,
			'show_in_rest'      => true,
			'rest_base'         => 'kategoriler',
			'hierarchical'      => true, // checkbox list in the editor
			'show_admin_column' => true,
			'show_in_nav_menus' => true,
		)
	);

	register_post_meta(
		'eser',
		'grup_kodu',
		array(
			'type'              => 'string',
			'single'            => true,
			'default'           => '',
			'show_in_rest'      => true,
			'sanitize_callback' => 'bostanci_sanitize_group',
			'auth_callback'     => static fn() => current_user_can( 'edit_posts' ),
		)
	);

	register_nav_menus( array( 'ana-menu' => 'Ana menü' ) );
}

function bostanci_sanitize_group( $value ) {
	return strtoupper( preg_replace( '/[^A-Za-z0-9_-]/', '', (string) $value ) );
}

register_activation_hook( __FILE__, 'bostanci_activate' );
register_deactivation_hook( __FILE__, 'bostanci_deactivate' );

function bostanci_activate() {
	bostanci_register_content();

	$defaults = array(
		'aquarelle'      => 'Aquarelle',
		'digitale-werke' => 'Digitale Werke',
		'gemaelde'       => 'Gemälde',
		'logo'           => 'Logo',
		'workshop'       => 'Workshop',
	);
	foreach ( $defaults as $slug => $name ) {
		if ( ! term_exists( $slug, 'eser_kategori' ) ) {
			wp_insert_term( $name, 'eser_kategori', array( 'slug' => $slug ) );
		}
	}

	// Editors (the artist) may edit the menu.
	$editor = get_role( 'editor' );
	if ( $editor ) {
		$editor->add_cap( 'edit_theme_options' );
	}
}

function bostanci_deactivate() {
	$editor = get_role( 'editor' );
	if ( $editor ) {
		$editor->remove_cap( 'edit_theme_options' );
	}
}

/* -------------------------------------------------------------------------
 * 2. Artwork editing screen
 * ---------------------------------------------------------------------- */

// The classic form (title, image, category, group) is simpler than the block editor here.
add_filter(
	'use_block_editor_for_post_type',
	static fn( $use, $type ) => 'eser' === $type ? false : $use,
	10,
	2
);

add_filter(
	'enter_title_here',
	static fn( $text, $post ) => 'eser' === $post->post_type ? 'Açıklama, ör. Kleine Synagoge / ERFURT / 2021 / 20 x 30 cm' : $text,
	10,
	2
);

add_action(
	'add_meta_boxes_eser',
	static function () {
		remove_meta_box( 'pageparentdiv', 'eser', 'side' ); // order is set by drag and drop in the list
		remove_meta_box( 'postcustom', 'eser', 'normal' );  // raw custom fields; the group code has its own box
		add_meta_box( 'bostanci_grup', 'Grup kodu', 'bostanci_group_box', 'eser', 'side', 'high' );
	}
);

function bostanci_group_box( $post ) {
	wp_nonce_field( 'bostanci_grup', 'bostanci_grup_nonce' );
	printf(
		'<input type="text" name="bostanci_grup_kodu" value="%s" class="widefat" placeholder="ör. A005">',
		esc_attr( get_post_meta( $post->ID, 'grup_kodu', true ) )
	);
	echo '<p class="description">Aynı grup koduna sahip eserler sitede yan yana gösterilir. Boş bırakılırsa eser tek başına gösterilir.</p>';
}

add_action(
	'save_post_eser',
	static function ( $post_id ) {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		$nonce = isset( $_POST['bostanci_grup_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['bostanci_grup_nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'bostanci_grup' ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		$group = isset( $_POST['bostanci_grup_kodu'] ) ? sanitize_text_field( wp_unslash( $_POST['bostanci_grup_kodu'] ) ) : '';
		update_post_meta( $post_id, 'grup_kodu', bostanci_sanitize_group( $group ) );
	}
);

/* -------------------------------------------------------------------------
 * 2b. Artwork addresses (slugs): the site shows every artwork at
 *     /werke/<category>/<slug>/. Slugs use German transliteration (ü -> ue,
 *     although the admin language is Turkish) and leave out the dimensions.
 *     A slug never changes after the artwork is published (stable URLs).
 * ---------------------------------------------------------------------- */

/** Slug base for a caption: "Die Kettenbrücke - NÜRNBERG 2025 / 65 x 50 cm" -> "die-kettenbruecke-nuernberg-2025". */
function bostanci_artwork_slug_base( $title ) {
	$title = html_entity_decode( (string) $title, ENT_QUOTES, 'UTF-8' );
	$title = preg_replace( '/\d+(?:[.,]\d+)?\s*[x×]\s*\d+(?:[.,]\d+)?\s*(?:cm|mm)?/iu', ' ', $title );
	$title = remove_accents( $title, 'de_DE' );
	$slug  = sanitize_title( $title );
	return '' !== $slug ? $slug : 'eser';
}

// New artworks: build the slug from the caption, unless one was entered by hand.
add_filter(
	'wp_insert_post_data',
	static function ( $data, $postarr ) {
		if ( 'eser' !== $data['post_type'] || ! empty( $postarr['post_name'] ) ) {
			return $data;
		}
		if ( in_array( $data['post_status'], array( 'draft', 'pending', 'auto-draft' ), true ) ) {
			return $data; // WordPress assigns slugs when publishing
		}
		$data['post_name'] = wp_unique_post_slug(
			bostanci_artwork_slug_base( $data['post_title'] ),
			(int) ( $postarr['ID'] ?? 0 ),
			$data['post_status'],
			'eser',
			0
		);
		return $data;
	},
	10,
	2
);

/**
 * One-time update of the slugs created before 1.0.3 (they had "nurnberg" and
 * the dimensions in them). Runs once when an administrator opens the admin.
 * Order = order on the site, so "-2", "-3" follow the gallery order.
 */
add_action(
	'admin_init',
	static function () {
		if ( 'done' === get_option( 'bostanci_slugs_v2' ) || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		update_option( 'bostanci_slugs_v2', 'done', false ); // first, so it can never run twice

		global $wpdb;
		$ids = get_posts(
			array(
				'post_type'      => 'eser',
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
				'fields'         => 'ids',
			)
		);
		// Free all current slugs first, so the new ones are assigned in order.
		foreach ( $ids as $id ) {
			$wpdb->update( $wpdb->posts, array( 'post_name' => 'bostanci-tmp-' . $id ), array( 'ID' => $id ) );
		}
		$changed = 0;
		foreach ( $ids as $id ) {
			$post = get_post( $id );
			clean_post_cache( $id );
			$slug = wp_unique_post_slug( bostanci_artwork_slug_base( $post->post_title ), $id, 'publish', 'eser', 0 );
			$wpdb->update( $wpdb->posts, array( 'post_name' => $slug ), array( 'ID' => $id ) );
			clean_post_cache( $id );
			++$changed;
		}
		update_option( 'bostanci_slugs_v2_count', $changed, false );
		bostanci_request_rebuild();
	}
);

add_action(
	'admin_notices',
	static function () {
		$count = (int) get_option( 'bostanci_slugs_v2_count' );
		if ( $count && current_user_can( 'manage_options' ) ) {
			delete_option( 'bostanci_slugs_v2_count' );
			printf( '<div class="notice notice-success is-dismissible"><p>%d eserin site adresi güncellendi.</p></div>', (int) $count );
		}
	}
);

/* -------------------------------------------------------------------------
 * 3. Artwork list: thumbnail + group columns, drag-and-drop ordering
 * ---------------------------------------------------------------------- */

add_filter(
	'manage_eser_posts_columns',
	static function ( $columns ) {
		$result = array();
		foreach ( $columns as $key => $label ) {
			if ( 'title' === $key ) {
				$result['bostanci_handle'] = '<span class="screen-reader-text">Sırala</span>';
				$result['bostanci_thumb']  = 'Görsel';
				$result['title']           = 'Açıklama';
				$result['bostanci_grup']   = 'Grup';
				continue;
			}
			if ( 'date' === $key ) {
				continue;
			}
			$result[ $key ] = $label;
		}
		return $result;
	}
);

add_action(
	'manage_eser_posts_custom_column',
	static function ( $column, $post_id ) {
		if ( 'bostanci_handle' === $column ) {
			echo '<span class="dashicons dashicons-menu bostanci-handle" title="Sürükleyerek sırala" aria-hidden="true"></span>';
		} elseif ( 'bostanci_thumb' === $column ) {
			$thumb = get_the_post_thumbnail( $post_id, array( 60, 60 ) );
			echo $thumb ? $thumb : '—'; // phpcs:ignore WordPress.Security.EscapeOutput -- core-generated <img>
		} elseif ( 'bostanci_grup' === $column ) {
			$group = get_post_meta( $post_id, 'grup_kodu', true );
			echo esc_html( $group ? $group : '—' );
		}
	},
	10,
	2
);

// Show the list in site order, all on one page, so drag and drop covers every item.
add_action(
	'pre_get_posts',
	static function ( $query ) {
		if ( ! is_admin() || ! $query->is_main_query() || 'eser' !== $query->get( 'post_type' ) ) {
			return;
		}
		if ( empty( $_GET['orderby'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- read-only list sorting
			$query->set( 'orderby', array( 'menu_order' => 'ASC', 'date' => 'DESC' ) );
		}
	}
);
add_filter( 'edit_eser_per_page', static fn() => 500 );

add_action(
	'admin_enqueue_scripts',
	static function ( $hook ) {
		$screen = get_current_screen();
		if ( 'edit.php' === $hook && $screen && 'eser' === $screen->post_type ) {
			wp_enqueue_script( 'jquery-ui-sortable' );
			wp_add_inline_script(
				'jquery-ui-sortable',
				'window.BostanciSort = ' . wp_json_encode( array( 'nonce' => wp_create_nonce( 'bostanci_sort' ) ) ) . ';' . bostanci_sort_js()
			);
		}
		if ( 'toplevel_page_bostanci-ayarlar' === $hook ) {
			wp_enqueue_media();
			wp_add_inline_script( 'media-editor', bostanci_settings_js() );
		}
	}
);

add_action(
	'admin_head',
	static function () {
		$screen = get_current_screen();
		if ( $screen && 'eser' === $screen->post_type && 'edit' === $screen->base ) {
			echo '<style>.column-bostanci_handle{width:28px}.column-bostanci_thumb{width:70px}.bostanci-handle{cursor:move;color:#8c8f94}#the-list tr.ui-sortable-helper{background:#f0f6fc;display:table}</style>';
		}
	}
);

function bostanci_sort_js() {
	return <<<'JS'
jQuery(function ($) {
	var $list = $('#the-list');
	if (!$list.length || $list.find('.bostanci-handle').length < 2) { return; }
	$list.sortable({
		handle: '.bostanci-handle',
		items: '> tr',
		axis: 'y',
		update: function () {
			var ids = $list.children('tr').map(function () { return this.id.replace('post-', ''); }).get();
			$.post(window.ajaxurl, { action: 'bostanci_sort', nonce: window.BostanciSort.nonce, ids: ids })
				.done(function (res) {
					if (!res || !res.success) { window.alert('Sıralama kaydedilemedi. Sayfayı yenileyip tekrar deneyin.'); }
				})
				.fail(function () { window.alert('Sıralama kaydedilemedi. Sayfayı yenileyip tekrar deneyin.'); });
		}
	});
});
JS;
}

add_action(
	'wp_ajax_bostanci_sort',
	static function () {
		check_ajax_referer( 'bostanci_sort', 'nonce' );
		if ( ! current_user_can( 'edit_others_posts' ) ) {
			wp_send_json_error( null, 403 );
		}
		$ids = isset( $_POST['ids'] ) ? array_values( array_filter( array_map( 'absint', (array) wp_unslash( $_POST['ids'] ) ) ) ) : array();
		if ( ! $ids ) {
			wp_send_json_error( null, 400 );
		}
		foreach ( $ids as $id ) {
			if ( 'eser' !== get_post_type( $id ) ) {
				wp_send_json_error( null, 400 );
			}
		}

		global $wpdb;
		foreach ( $ids as $position => $id ) {
			// Direct update: wp_update_post() would create a revision for every row.
			$wpdb->update( $wpdb->posts, array( 'menu_order' => $position + 1 ), array( 'ID' => $id ), array( '%d' ), array( '%d' ) );
			clean_post_cache( $id );
		}
		bostanci_request_rebuild();
		wp_send_json_success();
	}
);

add_action(
	'admin_notices',
	static function () {
		$screen = get_current_screen();
		if ( ! $screen || 'eser' !== $screen->post_type ) {
			return;
		}
		if ( 'edit' === $screen->base ) {
			echo '<div class="notice notice-info"><p>Eserlerin sitedeki sırasını değiştirmek için satırları soldaki <span class="dashicons dashicons-menu"></span> simgesinden tutup sürükleyin. Sıra otomatik kaydedilir.</p></div>';
		}
		if ( 'post' === $screen->base ) {
			$post = get_post();
			if ( $post && 'publish' === $post->post_status && ! has_post_thumbnail( $post ) ) {
				echo '<div class="notice notice-warning"><p>Bu eserin görseli yok, bu yüzden sitede gösterilmez.</p></div>';
			}
		}
	}
);

/* -------------------------------------------------------------------------
 * 4. Site settings page (home image, contact, social media)
 * ---------------------------------------------------------------------- */

function bostanci_get_settings() {
	$saved = get_option( BOSTANCI_SETTINGS, array() );
	return wp_parse_args(
		is_array( $saved ) ? $saved : array(),
		array(
			'home_image' => 0,
			'email'      => '',
			'address'    => '',
			'social'     => array(),
		)
	);
}

function bostanci_sanitize_settings( $input ) {
	$input = is_array( $input ) ? $input : array();
	// WordPress runs this twice when the option is saved for the first time
	// (update_option -> add_option), so "social" may already be a list.
	$raw    = $input['social'] ?? '';
	$lines  = is_array( $raw ) ? $raw : preg_split( '/\R/', (string) $raw );
	$social = array();
	foreach ( $lines as $line ) {
		$url = esc_url_raw( trim( $line ), array( 'https', 'http' ) );
		if ( $url ) {
			$social[] = $url;
		}
	}
	return array(
		'home_image' => absint( $input['home_image'] ?? 0 ),
		'email'      => sanitize_email( $input['email'] ?? '' ),
		'address'    => sanitize_text_field( $input['address'] ?? '' ),
		'social'     => $social,
	);
}

add_action(
	'admin_init',
	static function () {
		register_setting(
			'bostanci',
			BOSTANCI_SETTINGS,
			array(
				'type'              => 'array',
				'sanitize_callback' => 'bostanci_sanitize_settings',
				'default'           => array(),
			)
		);
	}
);

// Editors may save this settings page (options.php checks this capability).
add_filter( 'option_page_capability_bostanci', static fn() => 'edit_pages' );

add_action(
	'admin_menu',
	static function () {
		add_menu_page( 'Site Ayarları', 'Site Ayarları', 'edit_pages', 'bostanci-ayarlar', 'bostanci_settings_page', 'dashicons-admin-site-alt3', 3 );
	}
);

function bostanci_settings_page() {
	$s      = bostanci_get_settings();
	$name   = BOSTANCI_SETTINGS;
	$img    = $s['home_image'] ? wp_get_attachment_image_url( $s['home_image'], 'medium' ) : '';
	$status = get_option( BOSTANCI_STATUS );
	?>
	<div class="wrap">
		<h1>Site Ayarları</h1>
		<?php settings_errors(); // "Ayarlar kaydedildi." after saving; only automatic on core settings pages ?>
		<form method="post" action="options.php">
			<?php settings_fields( 'bostanci' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">Ana sayfa görseli</th>
					<td>
						<input type="hidden" id="bostanci-home-image" name="<?php echo esc_attr( $name ); ?>[home_image]" value="<?php echo esc_attr( $s['home_image'] ); ?>">
						<img id="bostanci-home-preview" src="<?php echo esc_url( $img ); ?>" alt="" style="max-width:300px;height:auto;margin-bottom:8px;<?php echo $img ? '' : 'display:none'; ?>">
						<p>
							<button type="button" class="button" id="bostanci-home-select">Görsel seç</button>
							<button type="button" class="button-link button-link-delete" id="bostanci-home-remove" <?php echo $img ? '' : 'style="display:none"'; ?>>Kaldır</button>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bostanci-email">E-posta</label></th>
					<td><input type="email" id="bostanci-email" class="regular-text" name="<?php echo esc_attr( $name ); ?>[email]" value="<?php echo esc_attr( $s['email'] ); ?>"></td>
				</tr>
				<tr>
					<th scope="row"><label for="bostanci-address">Adres</label></th>
					<td><input type="text" id="bostanci-address" class="regular-text" name="<?php echo esc_attr( $name ); ?>[address]" value="<?php echo esc_attr( $s['address'] ); ?>" placeholder="ör. Nürnberg, Deutschland"></td>
				</tr>
				<tr>
					<th scope="row"><label for="bostanci-social">Sosyal medya</label></th>
					<td>
						<textarea id="bostanci-social" class="large-text" rows="4" name="<?php echo esc_attr( $name ); ?>[social]"><?php echo esc_textarea( implode( "\n", $s['social'] ) ); ?></textarea>
						<p class="description">Her satıra bir bağlantı, ör. https://www.instagram.com/aquarelllkunst/</p>
					</td>
				</tr>
			</table>
			<?php submit_button( 'Kaydet' ); ?>
		</form>

		<h2>Site güncellemesi</h2>
		<p>Yayınladığınız her değişiklikten sonra site otomatik olarak güncellenir. Bu işlem birkaç dakika sürer.</p>
		<?php if ( is_array( $status ) ) : ?>
			<p>
				<strong>Son deneme:</strong> <?php echo esc_html( wp_date( 'd.m.Y H:i', (int) $status['time'] ) ); ?> –
				<span style="color:<?php echo $status['ok'] ? '#008a20' : '#d63638'; ?>"><?php echo esc_html( $status['message'] ); ?></span>
			</p>
		<?php endif; ?>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="bostanci_rebuild_now">
			<?php wp_nonce_field( 'bostanci_rebuild_now' ); ?>
			<?php submit_button( 'Siteyi şimdi güncelle', 'secondary', 'submit', false ); ?>
		</form>
	</div>
	<?php
}

function bostanci_settings_js() {
	return <<<'JS'
jQuery(function ($) {
	var frame;
	$('#bostanci-home-select').on('click', function (e) {
		e.preventDefault();
		if (!frame) {
			frame = wp.media({ title: 'Ana sayfa görseli', button: { text: 'Bu görseli kullan' }, library: { type: 'image' }, multiple: false });
			frame.on('select', function () {
				var a = frame.state().get('selection').first().toJSON();
				var url = a.sizes && a.sizes.medium ? a.sizes.medium.url : a.url;
				$('#bostanci-home-image').val(a.id);
				$('#bostanci-home-preview').attr('src', url).show();
				$('#bostanci-home-remove').show();
			});
		}
		frame.open();
	});
	$('#bostanci-home-remove').on('click', function (e) {
		e.preventDefault();
		$('#bostanci-home-image').val('');
		$('#bostanci-home-preview').hide();
		$(this).hide();
	});
});
JS;
}

add_action(
	'admin_post_bostanci_rebuild_now',
	static function () {
		if ( ! current_user_can( 'edit_pages' ) ) {
			wp_die( 'Bu işlem için yetkiniz yok.', 403 );
		}
		check_admin_referer( 'bostanci_rebuild_now' );
		bostanci_trigger_rebuild();
		wp_safe_redirect( admin_url( 'admin.php?page=bostanci-ayarlar' ) );
		exit;
	}
);

/* -------------------------------------------------------------------------
 * 5. Automatic rebuild: tell GitHub Actions that content changed
 * ---------------------------------------------------------------------- */

function bostanci_request_rebuild() {
	$GLOBALS['bostanci_rebuild_requested'] = true;
}

// Collect all changes of one request and send a single trigger at the end.
add_action(
	'shutdown',
	static function () {
		if ( empty( $GLOBALS['bostanci_rebuild_requested'] ) ) {
			return;
		}
		$GLOBALS['bostanci_rebuild_requested'] = false;
		bostanci_trigger_rebuild();
	}
);

add_action(
	'transition_post_status',
	static function ( $new_status, $old_status, $post ) {
		if ( ! in_array( $post->post_type, array( 'eser', 'page', 'post' ), true ) ) {
			return;
		}
		// Publishing, editing a published item, unpublishing and trashing all change the site.
		if ( 'publish' === $new_status || 'publish' === $old_status ) {
			bostanci_request_rebuild();
		}
	},
	10,
	3
);

foreach ( array(
	'created_eser_kategori',
	'edited_eser_kategori',
	'delete_eser_kategori',
	'wp_update_nav_menu',
	'edit_attachment',
	'add_option_' . BOSTANCI_SETTINGS,
	'update_option_' . BOSTANCI_SETTINGS,
) as $bostanci_hook ) {
	add_action( $bostanci_hook, 'bostanci_request_rebuild' );
}
unset( $bostanci_hook );

function bostanci_trigger_rebuild() {
	if ( ! defined( 'BOSTANCI_GITHUB_TOKEN' ) || ! defined( 'BOSTANCI_GITHUB_REPO' ) ) {
		bostanci_save_status( false, 'Otomatik güncelleme henüz ayarlanmadı (wp-config.php).' );
		return false;
	}

	$response = wp_remote_post(
		'https://api.github.com/repos/' . BOSTANCI_GITHUB_REPO . '/dispatches',
		array(
			'timeout' => 10,
			'headers' => array(
				'Authorization'        => 'Bearer ' . BOSTANCI_GITHUB_TOKEN,
				'Accept'               => 'application/vnd.github+json',
				'Content-Type'         => 'application/json',
				'X-GitHub-Api-Version' => '2022-11-28',
				'User-Agent'           => 'bostanci-cms',
			),
			'body'    => wp_json_encode( array( 'event_type' => 'cms-update' ) ),
		)
	);

	if ( is_wp_error( $response ) ) {
		bostanci_save_status( false, 'Bağlantı hatası: ' . $response->get_error_message() );
		return false;
	}
	$code = (int) wp_remote_retrieve_response_code( $response );
	if ( 204 !== $code ) {
		bostanci_save_status( false, 'GitHub isteği reddetti (HTTP ' . $code . ').' );
		return false;
	}
	bostanci_save_status( true, 'Güncelleme başlatıldı. Site birkaç dakika içinde yenilenir.' );
	return true;
}

function bostanci_save_status( $ok, $message ) {
	update_option(
		BOSTANCI_STATUS,
		array(
			'time'    => time(),
			'ok'      => (bool) $ok,
			'message' => $message,
		),
		false
	);
}

/* -------------------------------------------------------------------------
 * 6. Public read-only REST data for the site build
 * ---------------------------------------------------------------------- */

add_action(
	'rest_api_init',
	static function () {
		register_rest_field(
			'eser',
			'gorsel',
			array(
				'get_callback' => static fn( $post ) => bostanci_image_data( get_post_thumbnail_id( $post['id'] ) ),
				'schema'       => array(
					'type'    => array( 'object', 'null' ),
					'context' => array( 'view', 'edit' ),
				),
			)
		);

		register_rest_route(
			'bostanci/v1',
			'/ayarlar',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function () {
					$s = bostanci_get_settings();
					return array(
						'email'      => $s['email'],
						'address'    => $s['address'],
						'social'     => $s['social'],
						'home_image' => bostanci_image_data( $s['home_image'] ),
					);
				},
			)
		);

		register_rest_route(
			'bostanci/v1',
			'/menu',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => 'bostanci_menu_data',
			)
		);
	}
);

/**
 * Image URLs and sizes. "full" is WordPress' scaled copy (max 2560 px), so the
 * untouched original upload is never published.
 */
function bostanci_image_data( $attachment_id ) {
	$attachment_id = (int) $attachment_id;
	if ( ! $attachment_id || ! wp_attachment_is_image( $attachment_id ) ) {
		return null;
	}
	$full = wp_get_attachment_image_src( $attachment_id, 'full' );
	if ( ! $full ) {
		return null;
	}
	$sizes = array();
	foreach ( array( 'medium_large', 'large', '1536x1536', '2048x2048' ) as $size ) {
		$src = wp_get_attachment_image_src( $attachment_id, $size );
		if ( $src ) {
			$sizes[ $size ] = array(
				'url'    => $src[0],
				'width'  => (int) $src[1],
				'height' => (int) $src[2],
			);
		}
	}
	return array(
		'id'     => $attachment_id,
		'alt'    => (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
		'url'    => $full[0],
		'width'  => (int) $full[1],
		'height' => (int) $full[2],
		'sizes'  => $sizes,
	);
}

function bostanci_menu_data() {
	$locations = get_nav_menu_locations();
	if ( empty( $locations['ana-menu'] ) ) {
		return array();
	}
	$items = wp_get_nav_menu_items( $locations['ana-menu'] );
	$out   = array();
	foreach ( $items ? $items : array() as $item ) {
		$out[] = array(
			'id'     => (int) $item->ID,
			'parent' => (int) $item->menu_item_parent,
			'title'  => html_entity_decode( $item->title, ENT_QUOTES, 'UTF-8' ),
			'path'   => bostanci_menu_path( $item ),
		);
	}
	return $out;
}

/** Turns a menu item into a path on the public site. */
function bostanci_menu_path( $item ) {
	if ( 'taxonomy' === $item->type && 'eser_kategori' === $item->object ) {
		$term = get_term( (int) $item->object_id, 'eser_kategori' );
		return ( $term && ! is_wp_error( $term ) ) ? '/werke/' . $term->slug . '/' : '/';
	}
	if ( 'post_type' === $item->type && 'page' === $item->object ) {
		return '/' . get_page_uri( (int) $item->object_id ) . '/';
	}
	$url = (string) $item->url;
	foreach ( array( home_url(), BOSTANCI_PUBLIC_SITE ) as $base ) {
		if ( str_starts_with( $url, $base ) ) {
			$url = substr( $url, strlen( $base ) );
			break;
		}
	}
	return '' === $url ? '/' : $url;
}

/* -------------------------------------------------------------------------
 * 7. Headless hardening: no public front end, less information leakage
 * ---------------------------------------------------------------------- */

// Visitors never see WordPress itself; send them to the real site.
add_action(
	'template_redirect',
	static function () {
		wp_redirect( BOSTANCI_PUBLIC_SITE . '/', 301 ); // phpcs:ignore WordPress.Security.SafeRedirect -- fixed external target
		exit;
	}
);

// XML-RPC is not needed. xmlrpc_enabled only disables the authenticated methods,
// so also remove the rest (pingbacks, demo methods).
// Keep text exactly as typed: no automatic en dashes or locale-specific curly quotes in
// titles and texts the site build reads (the panel locale is Turkish, the site German).
add_filter( 'run_wptexturize', '__return_false' );

add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'xmlrpc_methods', '__return_empty_array' );
add_filter( 'the_generator', '__return_empty_string' );

// Hide user names from anonymous visitors (they would help password guessing).
add_filter(
	'rest_endpoints',
	static function ( $endpoints ) {
		if ( ! is_user_logged_in() ) {
			unset( $endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
		}
		return $endpoints;
	}
);

add_filter(
	'rest_post_dispatch',
	static function ( $response ) {
		if ( $response instanceof WP_HTTP_Response ) {
			$response->header( 'X-Robots-Tag', 'noindex, nofollow' );
		}
		return $response;
	}
);
