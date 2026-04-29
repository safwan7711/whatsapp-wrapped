all: report.pdf

report.pdf:report.tex
	pdflatex report.tex
	pdflatex report.tex
clean:
	rm -f *.aux *.log *.pdf *.out *.toc 