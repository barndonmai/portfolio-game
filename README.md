# Portfolio

  Hello!

  Instead of a standard portfolio website, this project lets you walk around a custom 2D room,
  interact with objects, and explore different parts of my background, experience, and work in a
  more personal way.

  ## Features

  - **Playable single-room 2D environment** with player movement
  - **Interactable objects** that open portfolio sections
  - **Proximity-based interaction prompts**
  - **Animated props** that make the room feel more alive
  - **Modal-based content system** for portfolio information
  - **Custom room layout and object placement**
  - **Pixel-art inspired visual direction**
  - **Immersive portfolio experience** instead of a traditional static site

  ## Tech Stack

  - **Phaser 3** for the game world, movement, collisions, and interactions
  - **React** for the UI, loading screen, and content layer
  - **TypeScript** for structure and maintainability
  - **Vite** for development and build tooling
  - **Tailwind CSS** for styling

  ## Architecture

  This project is split so that the game world and the UI layer have clear responsibilities.

  - **Phaser** handles:
    - room rendering
    - player movement
    - collisions
    - interactable detection
    - animated world props

  - **React** handles:
    - prompts
    - modals
    - portfolio section content
    - loading UI
    - UI state

  - **Data-driven structure**:
    - room objects and interactables are defined through structured data
    - content is separated from game logic
    - rendering logic has been modularized so room config, data, helpers, and renderers live in
  focused files
