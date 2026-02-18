import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('ImageGrid error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="no-results">
                    <p>Something went wrong loading the cards. Please refresh and try again.</p>
                </div>
            );
        }
        return this.props.children;
    }
}
