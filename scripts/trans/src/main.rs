use regex::{Captures, Regex};
use serde::Deserialize;
use serde_yaml::{Mapping, Value};

fn to_tags(value: &Mapping) -> Vec<String> {
    let mut res = Vec::new();
    if let Some(categories) = value.get("categories") {
        if let Some(vv) = categories.as_sequence() {
            let vl: Vec<String> = vv
                .iter()
                .map(|v| String::from(v.as_str().unwrap()))
                .collect();
            res.extend(vl);
        }
    }

    if let Some(categories) = value.get("tags") {
        if let Some(vv) = categories.as_sequence() {
            for vi in vv.iter() {
                if let Some(vis) = vi.as_str() {
                    res.push(String::from(vis));
                }
            }
        }
    }
    if res.is_empty() {
        println!("Warning: tags are empty");
    }
    res
}

fn parse(str: &str) -> Option<String> {
    let de = serde_yaml::Deserializer::from_str(str);
    let value = Value::deserialize(de).unwrap();
    let value = value.as_mapping()?;
    let title = value.get("title")?.as_str()?;
    let date = value.get("date")?.as_str()?;
    let mut toc = false;
    if let Some(t) = value.get("toc") {
        toc = t.as_bool().unwrap();
    }
    let tags = to_tags(value);
    let mut res = format!(
        "\
<post-metadata>
    <post-title>{}</post-title>
    <post-date>{}</post-date>
    <post-tags>{}</post-tags>
</post-metadata>
",
        title,
        date,
        tags.join(", ")
    );
    if toc {
        res.push_str("<div id=\"generated-toc\"></div>");
    } else {
        res.push_str("<div id=\"generated-toc\" style=\"display: none\"></div>");
    }
    res.push_str("\n\n");
    Some(res)
}

fn main() {
    let mut file = std::env::args();
    file.next();
    let file = file.next().expect("Input file path");
    let file_content = std::fs::read_to_string(file).unwrap();

    let re = Regex::new(r"^---\n([\s\S]*?)---\n").unwrap();
    let res = re.replace(&file_content, |caps: &Captures| parse(&caps[1]).unwrap());
    println!("{}", res);
}
