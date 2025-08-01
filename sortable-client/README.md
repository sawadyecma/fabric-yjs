# Sortable Client

This project is a client-side application that leverages Yjs for real-time collaboration and implements a unique ID regeneration method for sorting operations.

## Features

- **Real-time Collaboration**: Utilizes Yjs to enable seamless real-time collaboration between users. Yjs is a powerful CRDT (Conflict-free Replicated Data Type) framework that ensures consistency across distributed systems.
- **ID Regeneration for Sorting**: Implements a custom ID regeneration technique to handle sorting operations efficiently. This method ensures that IDs are unique and maintain the correct order, even when items are moved or reordered.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sawadyecma/fabric-yjs.git
   ```

2. **Navigate to the sortable-client directory**:

   ```bash
   cd fabric-yjs/sortable-client
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

## Usage

- **Real-time Collaboration**: The application allows multiple users to collaborate in real-time. Changes made by one user are instantly reflected for all other users.

- **Sorting with ID Regeneration**: The application uses a custom algorithm to regenerate IDs during sorting operations. This ensures that the order of items is preserved and conflicts are minimized.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.
