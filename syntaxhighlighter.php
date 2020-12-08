<?php /*

**************************************************************************

Plugin Name:  SyntaxHighlighter Placeholder
Version:      3.114514.5
Description:  Simple placeholder for SyntaxHighligher, converts syntaxhighlighter/code block to simple &lt;pre>&lt;code class="language-xxx"> block.
Author:       Alex Mills (Viper007Bond)
Author URI:   https://blog.mmf.moe
Text Domain:  syntaxhighlighter
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 5.2
Tested up to: 5.4
Requires PHP: 7.0

**************************************************************************/

class SyntaxHighlighter {
	var $pluginver = '3.114514.5';

	// Other special characters that need to be encoded before going into the database (namely to work around kses)
	var $specialchars = array('\0' => '&#92;&#48;');

	// Initalize the plugin by registering the hooks
	function __construct() {
		// Load localization domain
		load_plugin_textdomain('syntaxhighlighter');

		// Editor Blocks
		add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
		register_block_type('syntaxhighlighter/code', array(
			'render_callback' => array($this, 'render_block'),
		));
	}

	// Enqueue block assets for the Editor
	function enqueue_block_editor_assets() {
		wp_enqueue_script('syntaxhighlighter-blocks', plugins_url('dist/blocks.build.js', __FILE__), array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-editor'
		), ((defined('WP_DEBUG') && WP_DEBUG) || (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG)) ? filemtime(plugin_dir_path(__FILE__) . 'dist/blocks.build.js') : $this->pluginver);

		// WordPress 5.0+ only, no Gutenberg plugin support
		if (function_exists('wp_set_script_translations')) {
			wp_set_script_translations('syntaxhighlighter-blocks', 'syntaxhighlighter');
		}
	}

	/**
	 * Renders the content of the Gutenberg block on the front end
	 * using the shortcode callback. This ensures one source of truth
	 * and allows for forward compatibility.
	 *
	 * @param string $content The block's content.
	 *
	 * @return string The rendered content.
	 */
	public function render_block($attributes, $content) {
		$remaps = array(
			'className'       => 'classname',
			'firstLineNumber' => 'firstline',
			'highlightLines'  => 'highlight',
		);

		foreach ($remaps as $from => $to) {
			if (isset($attributes[$from])) {
				if (is_bool($attributes[$from])) {
					$attributes[$to] = ($attributes[$from]) ? '1' : '0';
				} else {
					$attributes[$to] = $attributes[$from];
				}

				unset($attributes[$from]);
			}
		}

		$code = preg_replace('#<pre [^>]+>([^<]+)?</pre>#', '$1', trim($content));

		$lang = $attributes['language'] ?: $attributes['lang'] ?: 'text';
		$firstLine = $attributes['firstline'] ?: 1;
		$highlight = $attributes['highlight'] ? ' data-highlight="' . $attributes['highlight'] . '"' : '';
		return <<<EOF
<pre><code class="language-$lang" data-firstline="$firstLine"$highlight>$code</code></pre>
EOF;
	}

	// No-name attribute fixing
	function attributefix($atts = array()) {
		if (empty($atts[0]))
			return $atts;

		// Quoted value
		if (0 !== preg_match('#=("|\')(.*?)\1#', $atts[0], $match))
			$atts[0] = $match[2];

		// Unquoted value
		elseif ('=' == substr($atts[0], 0, 1))
			$atts[0] = substr($atts[0], 1);

		return $atts;
	}
}


// Start this plugin once all other plugins are fully loaded
add_action('init', 'SyntaxHighlighter', 5);
function SyntaxHighlighter() {
	global $SyntaxHighlighter;
	$SyntaxHighlighter = new SyntaxHighlighter();
}
