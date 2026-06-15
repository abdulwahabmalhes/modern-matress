with open('src/pages/Home.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

best_seller_card = lines[511:604]

# Replace lines 812 to 864 with best_seller_card
new_lines = lines[:812] + best_seller_card + lines[864:]

with open('src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Done")
