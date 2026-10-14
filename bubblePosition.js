// Pure positioning helper for the preview bubble (no DOM access, unit-testable).
// anchor: {left, top, right, bottom} of the clicked slot; size: {width, height} of the bubble;
// viewport: {width, height}. Returns {left, top, maxWidth, maxHeight, side}.
export function computeBubblePosition(opts) {
    var anchor = opts.anchor;
    var viewport = opts.viewport;
    var margin = opts.margin == null ? 8 : opts.margin;
    var gap = opts.gap == null ? 12 : opts.gap;
    var horizontalBar = opts.orientation === 'horizontal';
    var edge = opts.edgePosition;
    var availW = Math.max(0, viewport.width - 2 * margin);
    var availH = Math.max(0, viewport.height - 2 * margin);
    var width = Math.min(opts.size.width, availW);
    var height = Math.min(opts.size.height, availH);

    // Preferred side faces away from the bar / screen edge.
    var preferred, opposite;
    if (horizontalBar) {
        preferred = edge === 'top' ? 'bottom' : 'top';
    } else {
        preferred = edge === 'left' ? 'right' : 'left';
    }
    opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[preferred];

    function room(side) {
        if (side === 'bottom') return viewport.height - margin - (anchor.bottom + gap);
        if (side === 'top') return anchor.top - gap - margin;
        if (side === 'right') return viewport.width - margin - (anchor.right + gap);
        return anchor.left - gap - margin;
    }
    var main = horizontalBar ? height : width;
    var side = preferred;
    if (room(preferred) < main) {
        if (room(opposite) >= main || room(opposite) > room(preferred)) side = opposite;
    }
    // If the chosen side still cannot hold the bubble, shrink it to the space left.
    var space = Math.max(0, room(side));
    if (horizontalBar && height > space) height = space;
    if (!horizontalBar && width > space) width = space;

    var left, top;
    if (horizontalBar) {
        top = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - height;
        left = (anchor.left + anchor.right) / 2 - width / 2;
    } else {
        left = side === 'right' ? anchor.right + gap : anchor.left - gap - width;
        top = (anchor.top + anchor.bottom) / 2 - height / 2;
    }
    left = Math.min(Math.max(left, margin), Math.max(margin, viewport.width - margin - width));
    top = Math.min(Math.max(top, margin), Math.max(margin, viewport.height - margin - height));
    return { left: left, top: top, maxWidth: availW, maxHeight: horizontalBar ? Math.max(space, 0) : availH, side: side };
}
