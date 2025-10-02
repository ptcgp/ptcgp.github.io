# Pokemon TCG Pocket Simulator - Component Structure

## Overview
The application has been refactored into a modular component-based architecture for better maintainability and organization.

## File Structure

### Main Files
- `index.html` - Main application entry point with minimal structure
- `styles/main.css` - Centralized CSS styles
- `js/app.js` - Main application coordinator
- `js/componentLoader.js` - Component loading system

### Components Directory (`/components/`)
- `navigation.html` - Navigation tabs
- `pack-simulator.html` - Pack simulation interface
- `collection-simulator.html` - Collection simulation interface  
- `specific-card.html` - Specific card simulation interface
- `gold-calculator.html` - Gold calculator interface
- `evolve-simulator.html` - Evolution simulator interface

### JavaScript Modules (`/js/`)
- `app.js` - Main application coordinator
- `componentLoader.js` - Dynamic component loading
- `ui.js` - UI event handlers and utilities
- `simulator.js` - Core simulation logic
- `charts.js` - Chart rendering
- `constants.js` - Application constants
- `validation.js` - Input validation
- `evolveSimulator.js` - Evolution simulator coordinator
- `evolveSimulationCore.js` - Evolution simulation logic
- `evolveUI.js` - Evolution UI handlers
- `evolveUtils.js` - Evolution utilities
- `evolveComparison.js` - Evolution comparison features

## Benefits of Modular Structure

### 1. **Maintainability**
- Each component is self-contained
- Easier to locate and modify specific features
- Reduced risk of breaking unrelated functionality

### 2. **Reusability**
- Components can be reused across different contexts
- Consistent styling and behavior
- Easy to create variations

### 3. **Collaboration**
- Multiple developers can work on different components
- Reduced merge conflicts
- Clear separation of concerns

### 4. **Performance**
- Components are loaded on-demand
- Smaller initial bundle size
- Better caching strategies

### 5. **Testing**
- Individual components can be tested in isolation
- Easier to mock dependencies
- More focused test cases

## Component Loading System

The `ComponentLoader` class handles:
- Dynamic loading of HTML components
- Caching of loaded components
- Error handling for missing components
- Promise-based loading system

### Usage
```javascript
const componentLoader = new ComponentLoader();
await componentLoader.loadAllComponents();
```

## Migration Notes

### What Changed
1. **HTML Structure**: Split into logical components
2. **CSS**: Moved to external stylesheet
3. **JavaScript**: Added component loading system
4. **File Organization**: Created dedicated directories

### What Stayed the Same
1. **Functionality**: All features work identically
2. **API**: No changes to existing JavaScript modules
3. **Styling**: Visual appearance remains unchanged
4. **Performance**: No impact on runtime performance

## Development Workflow

### Adding New Components
1. Create HTML file in `/components/`
2. Add component mapping to `componentLoader.js`
3. Update `app.js` if needed for initialization

### Modifying Existing Components
1. Edit the specific component file
2. Changes are automatically loaded
3. No need to modify main HTML

### Styling Changes
1. Update `styles/main.css`
2. Component-specific styles can be added to individual components
3. Global styles remain centralized

## File Size Comparison

### Before Modularization
- `index.html`: ~997 lines (all-in-one)

### After Modularization
- `index.html`: ~50 lines (main structure)
- `styles/main.css`: ~80 lines (centralized styles)
- `components/`: 6 files, ~50-200 lines each
- Total: Better organization, easier maintenance

## Future Enhancements

### Potential Improvements
1. **Lazy Loading**: Load components only when needed
2. **Component State**: Add state management for components
3. **Hot Reloading**: Development-time component reloading
4. **Component Testing**: Individual component test suites
5. **TypeScript**: Add type safety to components

### Scalability
- Easy to add new simulator types
- Simple to create component variations
- Straightforward to implement A/B testing
- Ready for micro-frontend architecture

## Evolve Simulator Card Play Plan

The Evolve Simulator implements a sophisticated card play strategy that follows Pokemon TCG rules and optimizes for Stage 2 evolution probability.

### Game Rules Implementation

#### **Turn Structure**
1. **Turn 0**: Draw 5 cards (guaranteed at least 1 Basic Pokemon)
2. **Each Turn**: Draw 1 card at the beginning
3. **Card Play Order**: Items → Supporters → Pokemon → Evolution
4. **Evolution Rules**: Cannot evolve on the same turn a Basic is played

#### **Card Types and Effects**

##### **Pokemon Cards**
- **Basic Pokemon**: Can be played to field (max 1 per turn)
- **Stage 1 Pokemon**: Evolves from Basic (requires Basic in field)
- **Stage 2 Pokemon**: Evolves from Stage 1 (requires Stage 1 in field)
- **Other Pokemon**: Non-evolution chain Pokemon for deck variety

##### **Supporter Cards**
- **Professor's Research**: Draw 2 cards (1 per turn limit)

##### **Item Cards**
- **Poké Ball**: Draw a Basic Pokemon from deck (multiple per turn)
- **Rare Candy**: Evolve Basic directly to Stage 2 (requires Basic played previous turn)
- **Pokémon Communication**: Swap a Pokemon in hand with random Pokemon from deck

### Strategic Play Logic

#### **Priority System**
1. **Poké Ball Usage**: Play immediately to thin deck and find Basic Pokemon
2. **Professor's Research**: Use for card draw when needed
3. **Pokémon Communication**: Strategic use only when evolution chain is incomplete
4. **Basic Pokemon Play**: Only if no evolution possible with current hand
5. **Evolution**: Always prioritize when possible

#### **Evolution Chain Optimization**
- **Basic → Stage 1**: Requires Basic in field + Stage 1 in hand
- **Stage 1 → Stage 2**: Requires Stage 1 in field + Stage 2 in hand  
- **Basic → Stage 2**: Requires Basic in field + Stage 2 in hand + Rare Candy

#### **Deck Thinning Strategy**
- **Poké Ball**: Reduces deck size by drawing Basic Pokemon
- **Extra Basics**: Hold in hand to reduce deck size
- **Communication**: Strategic swapping to find needed evolution pieces

### Simulation Parameters

#### **Deck Configuration**
- **Total Cards**: 20 cards maximum
- **Card Limits**: Maximum 2 copies of each card type
- **Evolution Chain**: Basic → Stage 1 → Stage 2
- **Other Pokemon**: Can be included but don't affect evolution chain

#### **Win Condition**
- **Target**: Achieve specified number of Stage 2 Pokemon
- **Success**: Counts turns to reach target
- **Failure**: Timeout after 100 turns

### Debug Mode Features

#### **Step-by-Step Logging**
- Initial hand and deck composition
- Turn-by-turn card draws
- Card play decisions and reasoning
- Evolution attempts and results
- Final hand and field state

#### **Strategic Decision Tracking**
- Why certain cards are played
- Why evolution is or isn't possible
- Deck thinning effectiveness
- Communication usage rationale

### Performance Optimization

#### **Simulation Efficiency**
- **Batch Processing**: Run thousands of simulations
- **Statistical Analysis**: Calculate probabilities and percentiles
- **Chart Generation**: Visual representation of results
- **Comparison Mode**: Side-by-side analysis of different configurations

#### **Memory Management**
- **Chart Instances**: Proper cleanup to prevent memory leaks
- **Component Loading**: Dynamic loading reduces initial bundle size
- **Error Handling**: Graceful failure for missing components

### Configuration Examples

#### **Quick Presets**
- **Full Support (2-2-2-2-2-2-2-2)**: Maximum card variety
- **Min Stage 1 (2-1-2-2-2-2-2-2)**: Reduced Stage 1 count
- **No Stage 1 (2-0-2-2-2-2-2-2)**: Stage 1 elimination
- **Minimal (2-2-2-0-0-0-0)**: Basic evolution chain only

#### **Advanced Configuration**
- **Other Pokemon**: Add variety without affecting evolution chain
- **Communication**: Strategic deck manipulation
- **Rare Candy**: Alternative evolution path
- **Debug Mode**: Single-run analysis with detailed logging
