// Layer information data
const layerInfo = {
    'application': {
        title: 'Application Layer',
        content: `
            <p>The Application Layer is the topmost layer in the TCP/IP model, closest to the end-user. It provides network services directly to applications.</p>
            <h3>Functions:</h3>
            <ul>
                <li>Provides interfaces for applications to use network services</li>
                <li>Handles data formatting and encoding</li>
                <li>Manages dialog and session between applications</li>
            </ul>
            <h3>Key Protocols:</h3>
            <ul>
                <li>HTTP/HTTPS (Web browsing)</li>
                <li>FTP (File transfer)</li>
                <li>SMTP/POP3/IMAP (Email)</li>
                <li>DNS (Domain name resolution)</li>
                <li>SSH (Secure remote access)</li>
            </ul>
            <p>At this layer, user data (like web page requests or email content) is in its original form before any network-specific formatting is applied.</p>
        `
    },
    // ... [Rest of the layer information objects] ...
};

// Define layerRadius as a global variable
let layerRadius = 2.5;

// Wait for the page to load
window.addEventListener('load', function() {
    // Three.js variables
    let scene, camera, renderer;
    let layers = {};
    let dataPacket;
    let animationInProgress = false;
    let packetTween;
    let sparkleParticles;
    let sparkleSystem;

    // Function to animate the packet
    function animatePacket() {
        if (animationInProgress) return;
        animationInProgress = true;
        
        // Reset packet
        dataPacket.scale.set(1, 1, 1);
        
        // Make packet visible and position above application layer
        dataPacket.visible = true;
        dataPacket.position.set(-2.5, layers.application.position.y + 2, 0);
        
        // Create animation sequence
        const startDelay = 500;
        const moveDownDuration = 1000;
        const passThroughDuration = 1500;
        const waitDuration = 500;
        
        // Animation sequence
        new TWEEN.Tween(dataPacket.position)
            .to({ y: layers.application.position.y }, moveDownDuration)
            .delay(startDelay)
            .easing(TWEEN.Easing.Bounce.Out)
            .start()
            .onComplete(() => {
                // Rest of animation sequence...
                // Add all the animation steps here
            });
    }

    // Function to reset animation
    function resetAnimation() {
        TWEEN.removeAll();
        dataPacket.visible = false;
        animationInProgress = false;
    }

    // Set up Three.js scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Load font and create layers
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
            createLayers(font);
            // Hide loading screen after layers are created
            document.getElementById('loading').style.display = 'none';
        });

        createDataPacket();
        createSparkles();

        // Add window resize listener
        window.addEventListener('resize', onWindowResize);

        // Set up Raycaster for interaction
        setupRaycaster();

        // Start animation loop
        animate();
    }

    // Create the TCP/IP layer boxes
    function createLayers(font) {
        const layerHeight = 1.2;
        const layerSegments = 32; // Smoothness of the cylinder
        const spacing = 0.3;
        
        const colors = {
            application: 0xff6347,  // Tomato red
            transport: 0xffa500,    // Orange
            internet: 0x6a5acd,     // Slate blue
            network: 0x3cb371       // Medium sea green
        };

        const startY = (layerHeight + spacing) * 1.5;
        const layerNames = ['application', 'transport', 'internet', 'network'];
        
        layerNames.forEach((name, index) => {
            const y = startY - (layerHeight + spacing) * index;
            
            // Create cylinder geometry
            const geometry = new THREE.CylinderGeometry(
                layerRadius,    // top radius
                layerRadius,    // bottom radius
                layerHeight,    // height
                layerSegments,  // radial segments
                1,              // height segments
                false           // open-ended
            );
            
            // Create texture with text for the cylinder
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size to wrap around cylinder
            const circumference = 2 * Math.PI * layerRadius;
            canvas.width = circumference * 100; // Scale for better resolution
            canvas.height = layerHeight * 100;
            
            // Fill with layer color
            ctx.fillStyle = '#' + colors[name].toString(16).padStart(6, '0');
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add text
            const displayName = name.charAt(0).toUpperCase() + name.slice(1) + ' Layer';
            ctx.font = 'bold 60px Arial';
            ctx.fillStyle = 'white';
            
            // Calculate text width to ensure it fits
            const textWidth = ctx.measureText(displayName).width;
            const textAreaWidth = canvas.width / 4; // Allocate 1/4 of circumference for text
            
            // Adjust font size if text is too wide
            if (textWidth > textAreaWidth * 0.9) {
                const scaleFactor = (textAreaWidth * 0.9) / textWidth;
                const newFontSize = Math.floor(60 * scaleFactor);
                ctx.font = `bold ${newFontSize}px Arial`;
            }
            
            // Position text at four points around the cylinder (0°, 90°, 180°, 270°)
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Front (0°)
            ctx.fillText(displayName, canvas.width * 0.0, canvas.height / 2);
            
            // Right (90°)
            ctx.fillText(displayName, canvas.width * 0.25, canvas.height / 2);
            
            // Back (180°)
            ctx.fillText(displayName, canvas.width * 0.5, canvas.height / 2);
            
            // Left (270°)
            ctx.fillText(displayName, canvas.width * 0.75, canvas.height / 2);
            
            // Create texture from canvas
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            
            // Create material with the texture
            const material = new THREE.MeshPhongMaterial({
                map: texture,
                transparent: true,
                opacity: 0.8,
                shininess: 30
            });
            
            // Create cylinder with the textured material
            const layer = new THREE.Mesh(geometry, material);
            layer.position.set(0, y, 0);
            layer.userData = { type: 'layer', name: name };
            
            scene.add(layer);
            layers[name] = layer;
        });
    }

    // Create data packet
    function createDataPacket() {
        const geometry = new THREE.SphereGeometry(0.4, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            emissive: 0x4444ff,
            emissiveIntensity: 0.6
        });
        
        dataPacket = new THREE.Mesh(geometry, material);
        dataPacket.position.set(0, 10, 0);
        dataPacket.visible = false;
        
        scene.add(dataPacket);
    }

    // Create sparkles
    function createSparkles() {
        // Sparkle creation code...
    }

    // Handle window resizing
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
        
        // Rotate cylinders in the opposite direction
        Object.values(layers).forEach(layer => {
            layer.rotation.y -= 0.002;
        });
        
        renderer.render(scene, camera);
    }

    // Set up raycaster
    function setupRaycaster() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        renderer.domElement.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            
            if (intersects.length > 0) {
                const object = intersects[0].object;
                if (object.userData && object.userData.type === 'layer') {
                    showLayerInfo(object.userData.name);
                }
            }
        });
    }

    // Show layer information
    function showLayerInfo(layerName) {
        const infoPanel = document.getElementById('info-panel');
        const infoTitle = document.getElementById('info-title');
        const infoContent = document.getElementById('info-content');
        
        const info = layerInfo[layerName];
        if (!info) {
            console.error(`Layer information not found for: ${layerName}`);
            return;
        }
        
        infoTitle.textContent = info.title;
        infoContent.innerHTML = info.content;
        infoPanel.style.display = 'block';
    }

    // Event listeners for buttons
    document.getElementById('start-animation').addEventListener('click', animatePacket);
    document.getElementById('reset-animation').addEventListener('click', resetAnimation);

    // Event listeners for layer labels
    document.querySelectorAll('.layer-label').forEach(label => {
        label.addEventListener('click', function() {
            const layerName = this.id.split('-')[0]; // Extract layer name from ID
            showLayerInfo(layerName);
        });
    });

    // Close info panel
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('info-panel').style.display = 'none';
    });

    // Initialize
    init();
}); 