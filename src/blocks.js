/**
 * BLOCK: SyntaxHighlighter Evolved (syntaxhighlighter/code)
 */

/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {registerBlockType, createBlock} from '@wordpress/blocks';
import {
	PanelBody,
	PanelRow,
	TextControl
} from '@wordpress/components';
import {PlainText, InspectorControls} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import deprecated from './deprecated';
import save from './save';

registerBlockType('syntaxhighlighter/code', {
	title: __('SyntaxHighlighter Code', 'syntaxhighlighter'),

	description: __('Adds syntax highlighting to source code (front end only).', 'syntaxhighlighter'),

	icon: 'editor-code',

	category: 'formatting',

	keywords: [
		// translators: Keyword that user might search for when trying to locate block.
		__('Source', 'syntaxhighlighter'),
		// translators: Keyword that user might search for when trying to locate block.
		__('Program', 'syntaxhighlighter'),
		// translators: Keyword that user might search for when trying to locate block.
		__('Develop', 'syntaxhighlighter'),
	],

	attributes: {
		content: {
			type: 'string',
			source: 'text',
			selector: 'code',
		},

		language: {
			type: 'string',
			default: 'text',
		},

		firstLineNumber: {
			type: 'string',
		},

		highlightLines: {
			type: 'string',
		},
	},

	supports: {
		html: false,
	},

	transforms: {
		from: [
			{
				type: 'raw',
				isMatch: (node) => (
					node.nodeName === 'PRE' &&
					node.children.length === 1 &&
					node.firstChild.nodeName === 'CODE'
				),
				schema: {
					pre: {
						children: {
							code: {
								children: {
									'#text': {},
								},
							},
						},
					},
				},
			},
			{
				type: 'block',
				blocks: ['core/code'],
				transform: ({content}) => {
					return createBlock('syntaxhighlighter/code', {content});
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: ['core/code'],
				transform: ({content}) => {
					return createBlock('core/code', {content});
				},
			},
		],
	},

	edit({attributes, setAttributes, className}) {
		const {
			content,
			language,
			firstLineNumber,
			highlightLines,
		} = attributes;

		let blockSettingRows = [];

		// Language
		blockSettingRows.push(
			wp.element.createElement(
				PanelRow,
				null,
				wp.element.createElement(
					TextControl,
					{
						label: __('Code Language', 'syntaxhighlighter'),
						value: language,
						onChange: (language) => setAttributes({language}),
					}
				)
			)
		);

		// First line number
		blockSettingRows.push(
			wp.element.createElement(
				PanelRow,
				null,
				wp.element.createElement(
					TextControl,
					{
						label: __('First Line Number', 'syntaxhighlighter'),
						type: 'number',
						value: firstLineNumber,
						onChange: (firstLineNumber) => setAttributes({firstLineNumber}),
						min: 1,
						max: 100000,
					}
				)
			)
		);

		// Highlight line(s)
		blockSettingRows.push(
			wp.element.createElement(
				TextControl,
				{
					label: __('Highlight Lines', 'syntaxhighlighter'),
					value: highlightLines,
					help: __('A comma-separated list of line numbers to highlight. Can also be a range. Example: 1,5,10-20', 'syntaxhighlighter'),
					onChange: (highlightLines) => setAttributes({highlightLines}),
				}
			)
		);

		const blockSettings = (
			<InspectorControls key="syntaxHighlighterInspectorControls">
				<PanelBody title={__('Settings', 'syntaxhighlighter')}>
					{blockSettingRows}
				</PanelBody>
			</InspectorControls>
		)

		const editView = (
			<div className={className + ' wp-block-code'}>
				<PlainText
					value={content}
					onChange={(content) => setAttributes({content})}
					placeholder={__('Tip: you can choose a code language from the block settings.', 'syntaxhighlighter')}
					aria-label={__('SyntaxHighlighter Code', 'syntaxhighlighter')}
				/>
			</div>
		)

		return [blockSettings, editView];
	},

	save,
	deprecated,
});
