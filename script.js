// Initialize interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Make model layers clickable
    const layers = document.querySelectorAll('.model-layer');
    layers.forEach(layer => {
        layer.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Simple Three.js visualizations
    function createScene(elementId) {
        const container = document.getElementById(elementId);
        if (!container) return null;
        
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf7fafc);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        return { scene, camera, renderer, container };
    }
    
    // Intro visualization - Network globe
    function setupIntroVis() {
        const setup = createScene('intro-canvas');
        if (!setup) return;
        
        const { scene, camera, renderer } = setup;
        
        // Create a globe
        const globeGeometry = new THREE.SphereGeometry(2, 32, 32);
        const globeMaterial = new THREE.MeshPhongMaterial({
            color: 0xe2e8f0,
            wireframe: true
        });
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);
        
        // Add nodes
        const nodes = [];
        for (let i = 0; i < 15; i++) {
            const phi = Math.acos(-1 + (2 * i) / 15);
            const theta = Math.sqrt(15 * Math.PI) * phi;
            
            const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x2b6cb0 });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            node.position.x = 2 * Math.sin(phi) * Math.cos(theta);
            node.position.y = 2 * Math.sin(phi) * Math.sin(theta);
            node.position.z = 2 * Math.cos(phi);
            
            scene.add(node);
            nodes.push(node);
        }
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            globe.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', function() {
            camera.aspect = setup.container.clientWidth / setup.container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(setup.container.clientWidth, setup.container.clientHeight);
        });
    }
    
    // HW/SW visualization
    function setupHwSwVis() {
        const setup = createScene('hw-sw-canvas');
        if (!setup) return;
        
        const { scene, camera, renderer } = setup;
        
        // Software layer
        const swGeometry = new THREE.BoxGeometry(3, 0.5, 0.5);
        const swMaterial = new THREE.MeshPhongMaterial({ color: 0x2b6cb0 });
        const swLayer = new THREE.Mesh(swGeometry, swMaterial);
        swLayer.position.y = 1;
        scene.add(swLayer);
        
        // Hardware layer
        const hwGeometry = new THREE.BoxGeometry(3, 0.5, 0.5);
        const hwMaterial = new THREE.MeshPhongMaterial({ color: 0x48bb78 });
        const hwLayer = new THREE.Mesh(hwGeometry, hwMaterial);
        hwLayer.position.y = -1;
        scene.add(hwLayer);
        
        // Connection line
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf56565 });
        const points = [
            new THREE.Vector3(0, 0.75, 0),
            new THREE.Vector3(0, -0.75, 0)
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            swLayer.rotation.y += 0.01;
            hwLayer.rotation.y -= 0.01;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', function() {
            camera.aspect = setup.container.clientWidth / setup.container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(setup.container.clientWidth, setup.container.clientHeight);
        });
    }
    
    // TCP/IP Model visualization
    function setupTcpIpVis() {
        const setup = createScene('tcp-ip-canvas');
        if (!setup) return;
        
        const { scene, camera, renderer } = setup;
        
        // Layer colors
        const colors = [0xf56565, 0x4299e1, 0x48bb78, 0x9f7aea];
        
        // Create four layers
        const layers = [];
        const positions = [1.5, 0.5, -0.5, -1.5];
        
        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.BoxGeometry(3, 0.5, 0.5);
            const material = new THREE.MeshPhongMaterial({ color: colors[i] });
            const layer = new THREE.Mesh(geometry, material);
            layer.position.y = positions[i];
            scene.add(layer);
            layers.push(layer);
        }
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            layers.forEach((layer, i) => {
                layer.rotation.y += 0.005 * (i % 2 === 0 ? 1 : -1);
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', function() {
            camera.aspect = setup.container.clientWidth / setup.container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(setup.container.clientWidth, setup.container.clientHeight);
        });
    }
    
    // OSI Model visualization
    function setupOsiVis() {
        const setup = createScene('osi-canvas');
        if (!setup) return;
        
        const { scene, camera, renderer } = setup;
        
        // Layer colors - rainbow gradient
        const colors = [
            0xe74c3c, 0xe67e22, 0xf1c40f, 0x2ecc71, 
            0x3498db, 0x9b59b6, 0x34495e
        ];
        
        // Create seven layers
        const layers = [];
        for (let i = 0; i < 7; i++) {
            const geometry = new THREE.BoxGeometry(3, 0.35, 0.35);
            const material = new THREE.MeshPhongMaterial({ color: colors[i] });
            const layer = new THREE.Mesh(geometry, material);
            
            // Position from top to bottom
            layer.position.y = 2.1 - i * 0.7;
            
            scene.add(layer);
            layers.push(layer);
        }
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            layers.forEach((layer, i) => {
                layer.rotation.y += 0.005 * (i % 2 === 0 ? 1 : -1);
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', function() {
            camera.aspect = setup.container.clientWidth / setup.container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(setup.container.clientWidth, setup.container.clientHeight);
        });
    }
    
    // Protocols visualization
    function setupProtocolVis() {
        const setup = createScene('protocol-canvas');
        if (!setup) return;
        
        const { scene, camera, renderer } = setup;
        
        // Create a client and server
        const clientGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.2);
        const clientMaterial = new THREE.MeshPhongMaterial({ color: 0x3498db });
        const client = new THREE.Mesh(clientGeometry, clientMaterial);
        client.position.set(-1.5, 0, 0);
        scene.add(client);
        
        const serverGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3);
        const serverMaterial = new THREE.MeshPhongMaterial({ color: 0x2ecc71 });
        const server = new THREE.Mesh(serverGeometry, serverMaterial);
        server.position.set(1.5, 0, 0);
        scene.add(server);
        
        // Connection line
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7f8c8d });
        const points = [
            new THREE.Vector3(-1.25, 0, 0),
            new THREE.Vector3(1.25, 0, 0)
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        
        // Packet for animation
        const packetGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const packetMaterial = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
        const packet = new THREE.Mesh(packetGeometry, packetMaterial);
        packet.position.set(-1.25, 0, 0);
        packet.visible = false;
        scene.add(packet);
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            client.rotation.y += 0.01;
            server.rotation.y += 0.01;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Demo buttons
        document.getElementById('dns-demo').addEventListener('click', function() {
            showTerminalOutput('nslookup example.com', [
                'Server: 192.168.1.1',
                'Address: 192.168.1.1#53',
                '',
                'Non-authoritative answer:',
                'Name: example.com',
                'Address: 93.184.216.34'
            ]);
        });
        
        document.getElementById('tcp-demo').addEventListener('click', function() {
            showTerminalOutput('tcpdump -n port 80', [
                'SYN > Flags [S], seq 3442116363',
                'SYN-ACK < Flags [S.], seq 2117437867, ack 3442116364',
                'ACK > Flags [.], ack 2117437868',
                'Connection established'
            ]);
            
            // Animate packet
            animatePacket();
        });
        
        document.getElementById('http-demo').addEventListener('click', function() {
            showTerminalOutput('curl -v example.com', [
                '* Connected to example.com',
                '> GET / HTTP/1.1',
                '> Host: example.com',
                '> User-Agent: curl/7.68.0',
                '< HTTP/1.1 200 OK',
                '< Content-Type: text/html'
            ]);
        });
        
        function showTerminalOutput(command, lines) {
            const terminal = document.getElementById('protocol-terminal');
            terminal.innerHTML = `<span class="terminal-line prompt">$ ${command}</span>`;
            
            lines.forEach((line, i) => {
                setTimeout(() => {
                    terminal.innerHTML += `<span class="terminal-line result">${line}</span>`;
                }, 300 * (i + 1));
            });
            
            setTimeout(() => {
                terminal.innerHTML += '<span class="terminal-line prompt">$ <span class="blinking-cursor">_</span></span>';
            }, 300 * (lines.length + 1));
        }
        
        function animatePacket() {
            packet.visible = true;
            packet.position.set(-1.25, 0, 0);
            
            let direction = 1;
            let animationTime = 0;
            
            const animateFrame = () => {
                animationTime += 0.02;
                
                if (direction > 0) {
                    packet.position.x += 0.05;
                    if (packet.position.x >= 1.25) {
                        direction = -1;
                    }
                } else {
                    packet.position.x -= 0.05;
                    if (packet.position.x <= -1.25) {
                        packet.visible = false;
                        return;
                    }
                }
                
                if (animationTime < 2) {
                    requestAnimationFrame(animateFrame);
                }
            };
            
            animateFrame();
        }
        
        // Handle resize
        window.addEventListener('resize', function() {
            camera.aspect = setup.container.clientWidth / setup.container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(setup.container.clientWidth, setup.container.clientHeight);
        });
    }
    
    // 5G visualization
    function setup5GVis() {
        const setup = createScene('5g-canvas');
        if (!setup) return;
        
        const { scene, camera, renderer } = setup;
        
        // Component colors
        const colors = [0xe74c3c, 0xf39c12, 0x2ecc71, 0x3498db, 0x9b59b6];
        
        // Create 5G components
        const components = [];
        const positions = [
            { x: 0, y: 1, z: 0 },     // AMF
            { x: -1, y: 0, z: 0 },    // SMF
            { x: 1, y: 0, z: 0 },     // UPF
            { x: -0.5, y: -1, z: 0 }, // PCF
            { x: 0.5, y: -1, z: 0 }   // UDM
        ];
        
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
            const material = new THREE.MeshPhongMaterial({ color: colors[i] });
            const component = new THREE.Mesh(geometry, material);
            component.position.set(positions[i].x, positions[i].y, positions[i].z);
            scene.add(component);
            components.push(component);
        }
        
        // Create connections
        const connections = [
            { from: 0, to: 1 }, { from: 0, to: 2 },
            { from: 0, to: 3 }, { from: 0, to: 4 },
            { from: 1, to: 2 }, { from: 3, to: 4 }
        ];
        
        connections.forEach(conn => {
            const points = [
                new THREE.Vector3(positions[conn.from].x, positions[conn.from].y, positions[conn.from].z),
                new THREE.Vector3(positions[conn.to].x, positions[conn.to].y, positions[conn.to].z)
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: 0x7f8c8d,
                transparent: true,
                opacity: 0.5
            });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            components.forEach((comp, i) => {
                comp.rotation.y += 0.01 * (i % 2 === 0 ? 1 : -1);
                comp.rotation.x += 0.005 * (i % 2 === 0 ? 1 : -1);
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Demo buttons
        document.getElementById('embb-demo').addEventListener('click', function() {
            showSliceInfo('eMBB', 'Enhanced Mobile Broadband', [
                'High bandwidth for consumer applications',
                'Use cases: 4K/8K video, augmented reality',
                'Prioritizes throughput over latency'
            ]);
        });
        
        document.getElementById('urllc-demo').addEventListener('click', function() {
            showSliceInfo('URLLC', 'Ultra-Reliable Low Latency Communications', [
                'Extremely low latency and high reliability',
                'Use cases: autonomous vehicles, remote surgery',
                'Requires < 1ms latency and 99.999% reliability'
            ]);
        });
        
        document.getElementById('mmtc-demo').addEventListener('click', function() {
            showSliceInfo('mMTC', 'Massive Machine Type Communications', [
                'Support for massive number of IoT devices',
                'Use cases: smart cities, agricultural sensors',
                'Optimized for low power, intermittent connectivity'
            ]);
        });
        
        function showSliceInfo(name, fullName, details) {
            const terminal = document.getElementById('5g-terminal');
            terminal.innerHTML = `<span class="terminal-line prompt">$ activate-slice ${name}</span>`;
            
            setTimeout(() => {
                terminal.innerHTML += `<span class="terminal-line result">Activating ${fullName} slice...</span>`;
            }, 300);
            
            details.forEach((detail, i) => {
                setTimeout(() => {
                    terminal.innerHTML += `<span class="terminal-line result">${detail}</span>`;
                }, 600 + 300 * i);
            });
            
            setTimeout(() => {
                terminal.innerHTML += `<span class="terminal-line result">Slice activated successfully</span>`;
                terminal.innerHTML += '<span class="terminal-line prompt">$ <span class="blinking-cursor">_</span></span>';
            }, 600 + 300 * details.length);
        }
        
        // Handle resize
        window.addEventListener('resize', function() {
            camera.aspect = setup.container.clientWidth / setup.container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(setup.container.clientWidth, setup.container.clientHeight);
        });
    }
    
    // Initialize all visualizations
    setupIntroVis();
    setupHwSwVis();
    setupTcpIpVis();
    setupOsiVis();
    setupProtocolVis();
    setup5GVis();
    
    // Navigation handling
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 60,
                behavior: 'smooth'
            });
        });
    });
});