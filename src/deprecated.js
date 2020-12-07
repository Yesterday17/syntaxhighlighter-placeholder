export default [
	{
		attributes: {
			content: {
				type: 'string',
					source: 'text',
					selector: 'pre',
			},

			language: {
				type: 'string',
				default: 'text',
			},

			lineNumbers: {
				type: 'boolean',
				default: true,
			},

			firstLineNumber: {
				type: 'string',
			},

			highlightLines: {
				type: 'string',
			},
		},

		save( { attributes } ) {
			return( <pre>{ attributes.content }</pre> );
		},
	},
];
