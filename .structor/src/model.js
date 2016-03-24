export default {
    pageName: 'UnnamedPage',
    pagePath: 'UnnamedPage',
    children: [
        {
            type: 'h3',
            props: {
                style: {
                    padding: '1em',
                    textAlign: 'center'
                }
            },
            children: [
                {
                    type: 'span',
                    text: 'There are errors during rendering of the page. Please see console output.'
                }
            ]
        }
    ]
};
