import os
import re

target_directory = input("Enter target directory: ")

for file_name in os.listdir(target_directory):
    with open(os.path.join(target_directory, file_name), 'r') as f:
        content = f.read()
        new_content = re.sub(r'className="(.*?)"', r'className={styles["\1"]}', content, flags = re.M)
        
        with open(os.path.join(target_directory, file_name), "w") as f_other:
            f_other.write(new_content)

