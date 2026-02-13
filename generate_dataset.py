import pandas as pd
import numpy as np
import random

def generate_milk_dataset(num_samples=1000):
    """
    Generates a synthetic dataset for milk shelf life prediction based on scientific principles.
    
    Factors modeled:
    - Temperature (Arrhenius / Q10 effect): Higher temp = faster spoilage.
    - pH (Microbial acidification): Lower pH indicates spoilage.
    - Initial Bacterial Load: Higher load = faster spoilage.
    - Fat Content: Minor effect.
    """
    
    data = []
    
    milk_types = ['Whole Milk', '2% Milk', 'Fat-Free Milk']
    
    for _ in range(num_samples):
        # 1. Milk Type & Fat (Standardized)
        milk_type = random.choice(milk_types)
        if milk_type == 'Whole Milk':
            fat = 3.25 + np.random.normal(0, 0.1)
        elif milk_type == '2% Milk':
            fat = 2.0 + np.random.normal(0, 0.1)
        else:
            fat = 0.1 + np.random.normal(0, 0.05)
        
        # 2. Storage Temperature (°C)
        # Mix of good refrigeration (2-6°C) and abuse conditions (7-15°C)
        if random.random() < 0.7:
            temp = np.random.normal(4, 1.5) # Normal storage
        else:
            temp = np.random.normal(10, 3) # Abuse
        temp = max(0, min(temp, 25)) # Clamp to realistic values

        # 3. Initial Bacterial Count (CFU/ml) - Log-normal distribution
        # Fresh milk usually < 50,000.  > 100,000 is poor quality.
        log_bacteria = np.random.normal(3.5, 0.5) # 10^3.5 ~ 3,162 CFU
        initial_bacteria = int(10 ** log_bacteria)
        initial_bacteria = max(100, initial_bacteria)

        # 4. pH Level (Acidity)
        # Fresh milk is 6.6 - 6.8.  Spoilage drops it below 6.4. 
        # We simulate the pH *at the time of measurement*, which might be after some storage.
        # However, for prediction, we usually measure current state to predict REMAINING life.
        # Let's assume these are measurements taken at "Day 0" of monitoring.
        ph = np.random.normal(6.7, 0.05)
        
        # 5. Humidity (minor factor for sealed cartons, impacts packaging)
        humidity = np.random.normal(65, 5)

        # --- SHELF LIFE CALCULATION (Ground Truth) ---
        # Base shelf life at optimal conditions (4°C, low bacteria) ~ 10-14 days (240-336 hours)
        base_hours = 300 

        # A. Temperature Penalty (Q10 ~ 2.0 to 3.0 for biological spoilage)
        # Rate increases 2-3x for every 10°C rise.
        # Factor = Q10 ^ ((Temp - BaseTemp) / 10)
        # If Q10=2.5, BaseTemp=4. 
        q10_factor = 2.5 ** ((temp - 4) / 10)
        
        # B. Bacterial Penalty
        # Higher initial load reduces shelf life logarithmically
        bacteria_factor = 1.0
        if initial_bacteria > 50000:
            bacteria_factor = 0.6
        elif initial_bacteria > 10000:
            bacteria_factor = 0.8
        
        # C. pH Penalty (Already acidic = less remaining life)
        ph_factor = 1.0
        if ph < 6.6:
            ph_factor = 0.5 # Rapidly degrading
        
        # Calculate ideal remaining shelf life
        predicted_hours = (base_hours / q10_factor) * bacteria_factor * ph_factor
        
        # Add random noise (biological variability) +/- 10%
        noise = np.random.normal(0, 0.1)
        final_shelf_life = int(predicted_hours * (1 + noise))
        final_shelf_life = max(0, final_shelf_life)

        # Assign Quality Label
        if final_shelf_life > 168: # > 7 days
            quality = 'High'
        elif final_shelf_life > 72: # > 3 days
            quality = 'Medium'
        else:
            quality = 'Low'

        data.append({
            'Temperature_C': round(temp, 1),
            'pH': round(ph, 2),
            'Initial_Bacteria_CFU': initial_bacteria,
            'Fat_Content_Percent': round(fat, 2),
            'Humidity_Percent': round(humidity, 1),
            'Milk_Type': milk_type,
            'Shelf_Life_Hours': final_shelf_life,
            'Quality_Label': quality
        })

    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    print("Generating synthetic milk dataset...")
    df = generate_milk_dataset(2000)
    
    filename = "milk_shelf_life_dataset.csv"
    df.to_csv(filename, index=False)
    
    print(f"Dataset generated successfully: {filename}")
    print(df.head())
    print("\nCorrelation with Shelf Life:")
    print(df.select_dtypes(include=[np.number]).corr()['Shelf_Life_Hours'])
