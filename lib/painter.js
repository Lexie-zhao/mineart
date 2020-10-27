
window.Painter = function() {
    var Painter = {};

    // Initialize: Initialize the painting canvas.
    Painter.Initialize = (Selector) => {
        Painter.Container = $(Selector);
        Painter.Canvas = new fabric.Canvas(Painter.Container.find("canvas").get(0), {
            isDrawingMode: true
        });
    }

    // LoadBackground: Load a given background image and resize the canvas.
    Painter.LoadBackground = (Target) => {
        fabric.Image.fromURL(Target, (Image) => {
            Painter.Background = Image;
            // Get the width of the container
            var ContainerWidth = Painter.Container.width();
            // Then we get the scale of the background image
            var BackgroundScale = ContainerWidth / Image.width;
            var ContainerHeight = Image.height * BackgroundScale;
            Image.scale(BackgroundScale);
            // Now that we have the size, we put it in effect
            Painter.Container.css("height", `${ContainerHeight}px`);
            Painter.Canvas.setDimensions({ width: ContainerWidth, height: ContainerHeight });
            Painter.Canvas.add(Image);
            // Cache it so that we can use it in the future
            Painter.ContainerWidth = ContainerWidth;
            Painter.ContainerHeight = ContainerHeight;
            // Composition mode for brushes
            Painter.Canvas.on("path:created", (Operation) => {
                if ($(Painter.Canvas.upperCanvasEl).css("mix-blend-mode") != "normal")
                    Operation.path.globalCompositeOperation = Painter.CompositionMode;
            });
            // Default brush
            Painter.SetBrushWidth(30);
            Painter.SetBrushMode("color", "color");
            Painter.SetBrushColor("black");
        })
    }

    // UseEraser: Use the eraser brush.
    Painter.UseEraser = () => {
        var Brush = new fabric.PatternBrush(Painter.Canvas);
        Brush.getPatternSrc = function() {
            var ImageCanvas = fabric.document.createElement("canvas");
            ImageCanvas.width = Painter.ContainerWidth;
            ImageCanvas.height = Painter.ContainerHeight;
            ImageCanvas.getContext("2d").drawImage(Painter.Background._element, 0, 0, Painter.ContainerWidth, Painter.ContainerHeight);
            return ImageCanvas;
        };
        Painter.InitializeBrush(Brush, true);
        $(Painter.Canvas.upperCanvasEl).css("mix-blend-mode", "normal");
    }

    // UsePencil: Use the pencil brush.
    Painter.UsePencil = () => {
        var Brush = new fabric.PencilBrush(Painter.Canvas);
        Painter.InitializeBrush(Brush, false);
    }
    
    // UseSpray: Use the spray brush.
    Painter.UseSpray = () => {
        var Brush = new fabric.SprayBrush(Painter.Canvas);
        Brush.dotWidth = 5;
        Brush.dotWidthVariance = 2;
        Brush.randomOpacity = true;
        Brush.density = 5;
        Painter.InitializeBrush(Brush, false);
    }

    // InitializeBrush: Initialize a brush.
    Painter.InitializeBrush = (Brush, IsEraser) => {
        Painter.Canvas.freeDrawingBrush = Brush;
        Painter.SetBrushWidth(Painter.BrushWidth);
        if (!IsEraser) {
            Painter.SetBrushColor(Painter.BrushColor);
            Painter.SetBrushMode(Painter.CompositionMode, Painter.BlendingMOde);
        }
    }

    // SetBrushWidth: Set the width of the brush.
    Painter.SetBrushWidth = (Width) => {
        Painter.BrushWidth = Width;
        Painter.Canvas.freeDrawingBrush.width = Width;
    }

    // SetBrushColor: Set the color of the brush.
    Painter.SetBrushColor = (Color) => {
        Painter.BrushColor = Color;
        Painter.Canvas.freeDrawingBrush.color = Color;
    }

    // SetBrushMode: Set the blending mode of the brush.
    Painter.SetBrushMode = (CompositionMode, BlendingMode) => {
        Painter.CompositionMode = CompositionMode;
        Painter.BlendingMode = BlendingMode;
        $(Painter.Canvas.upperCanvasEl).css("mix-blend-mode", BlendingMode);
    }

    return Painter;
}();